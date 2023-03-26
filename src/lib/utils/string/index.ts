let textArea: HTMLTextAreaElement;
export function unescapeString(escaped: string): string {
  if (!textArea) textArea = document.createElement("textarea");
  textArea.innerHTML = escaped;

  return textArea.value;
}
