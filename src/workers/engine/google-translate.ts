import { mapLanguageToGoogleSupported } from "$lib/utils/languages/map-language";

const apiEndpoint = "https://translation.googleapis.com/language/translate/v2";

export async function GoogleTranslate({
  env,
  text,
  lang,
}: {
  env: Env;
  text: string;
  lang: string;
}): Promise<string> {
  console.log("🍌 Translate using Google");
  const data: i18nData[] = JSON.parse(text).data;
  const textArray: string[] = data.map((child: i18nData) => child.textContent);

  const res = await fetch(apiEndpoint, {
    headers: {
      "X-goog-api-key": env.GCP_API_KEY,
      "Content-Type": "application/json; charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({
      q: textArray,
      target: mapLanguageToGoogleSupported(lang),
    }),
  });

  const json: any = await res.json();

  const translatedTextArray: {
    translatedText: string;
    detectedSourceLanguage: string;
  }[] = json?.data?.translations;

  console.log({ translatedTextArray, json: JSON.stringify(json) });

  return JSON.stringify({
    data: data.map((child: i18nData, i) => {
      child.textContent = translatedTextArray?.[i]?.translatedText;
      return child;
    }),
  });
}
