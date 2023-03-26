import { sha256 } from "hash-wasm";
import uuid from "short-uuid";
import { unescapeString } from "../string";
// import hash from "object-hash";

export function applyDOMTranslation(data: i18nData) {
  const list = document.body.querySelectorAll(`.${data.class}`);
  if (!list) return;
  list.forEach((el: Element) => {
    el.textContent = unescapeString(data.textContent);
  });
}

export function applyParentTranslation(translationArray: i18nData[]) {
  for (const data of translationArray) {
    applyDOMTranslation(data);
  }
}

export async function signTranslatedElement(el: Element): Promise<string> {
  const hash = (await sha256(el.textContent || "")).slice(0, 7);
  const signClass = `translated-${hash}`;
  el.classList.add(signClass);
  el.classList.add("i18n-translated");
  return signClass;
}

export async function getContentData(
  containerEl: HTMLElement,
  querySelector: string
): Promise<i18nData[]> {
  let data: i18nData[] = [];
  let promises: Promise<i18nData>[] = [];
  const parentEl = containerEl.parentElement;
  if (!parentEl) return data;

  const siblings = parentEl.querySelectorAll(querySelector);

  siblings.forEach(async (el: Element) => {
    if (!el.textContent) return;
    promises.push(
      new Promise(async (resolve) => {
        resolve({
          class: await signTranslatedElement(el),
          // hash: await sha256(el.textContent!),
          textContent: el.textContent!,
        });
      })
    );
  });

  data = await Promise.all(promises);

  return data;
}

export function hashJson(json: any) {
  const sortedEntries = Object.entries(json).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const sortedJson = JSON.stringify(Object.fromEntries(sortedEntries));
  return sha256(sortedJson); // use your preferred hashing function here
}

export async function hashArray(array: i18nData[]): Promise<string> {
  // Create a deep copy of the array and sort it
  const sortedArray = JSON.parse(JSON.stringify(array))
    // .map(
    //   (arr: i18nData) => arr.textContent
    // );
    .sort((a: i18nData, b: i18nData) => {
      return JSON.stringify(a) < JSON.stringify(b) ? -1 : 1;
    });

  // Sort the properties of each object in the array
  sortedArray.forEach((obj: i18nData) => {
    Object.keys(obj)
      .sort()
      .forEach((key: string) => {
        const value = obj[key as i18nDataKey];
        delete obj[key as i18nDataKey];
        // if (key === "textContent") obj[key as i18nDataKey] = value;
        obj[key as i18nDataKey] = value;
      });
  });

  return sha256(JSON.stringify(sortedArray));
}

interface translateOpts {
  endpoint: string;
  lang?: string;
  customLang?: boolean;
}

export async function translate(
  containerEl: HTMLElement,
  querySelector: string = "*",
  { endpoint, lang, customLang }: translateOpts
) {
  querySelector = querySelector + ":not(.i18n-widget)";
  const data = await getContentData(containerEl, querySelector);
  const hash = await hashArray(data);
  const body: any = {
    hash,
    data,
  };
  if (lang) body.lang = lang;
  if (customLang) body.customLang = customLang;
  console.log({ hash, data });

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": `text/plain`,
    },
    // mode: "no-cors",
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status > 299) return;
  const json = await res.json();
  const translatedData: i18nData[] = (json as any).data;
  if (!translatedData?.[0]?.textContent) return;
  applyParentTranslation(translatedData);
}
