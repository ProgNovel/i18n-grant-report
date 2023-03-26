export function getCountryFlagUrl(countryISOCode: string) {
  return (
    "https://lipis.github.io/flag-icon-css/flags/4x3/" + countryISOCode + ".svg"
  );
}

export function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    //@ts-ignore
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
