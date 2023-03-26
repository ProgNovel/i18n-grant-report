import { googleLanguageSupport } from "./google-list";

export function mapLanguageToGoogleSupported(countryISOCode: string) {
  const iso = countryISOCode.toLowerCase();

  switch (iso) {
    // "xx" means not supported/recognized country by Cloudflare
    case "xx" || "us" || "gb" || "ca" || "au":
      return "en";
    case "jp":
      return "ja";
    case "cn":
      return "zh";
    case "tw" || "hk" || "mo":
      return "zh-TW";
    default:
      if (Object.keys(googleLanguageSupport).includes(iso)) {
        return iso;
      } else {
        return "en";
      }
  }
}
