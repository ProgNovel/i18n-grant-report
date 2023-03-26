import { getChatGPTPOSTFormat } from "..";

export async function ChatGPTTranslate({
  env,
  text,
  lang,
}: {
  env: Env;
  text: string;
  lang: string;
}): Promise<string> {
  console.log("👋 Translate using ChatGPT");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(getChatGPTPOSTFormat(text, lang)),
  });

  const reply = (await res.json()) as OpenAIReplyAPI;
  const content = reply?.choices?.[0]?.message?.content;

  console.log(content);

  // return (reply?.choices?.[0]?.message?.content).split("}").slice(0, -1) + "}";
  return content;
}
