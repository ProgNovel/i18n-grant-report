import { response } from "./";
import { ChatGPTTranslate } from "./engine/chatgpt-translate";
import { GoogleTranslate } from "./engine/google-translate";

export async function translateEndpointHandle(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const cache = env.BUCKET;
  console.log(request.headers.get("Content-Type"));
  const text = await request.text();
  const hash = JSON.parse(text).hash;
  const lang: string = //@ts-ignore
    ((JSON.parse(text).lang || request.cf.country) as string).toUpperCase();

  const data = JSON.parse(text).data;

  const cacheKey = `${lang}:${hash}`;
  let replyContent = await cache.get(cacheKey);
  if (replyContent && JSON.parse(replyContent)?.data?.length) {
    console.log("🔥 Reading from KV Workers for blazing fast response");
    return response(replyContent, env);
  }
  try {
    if (env.GCP_API_KEY && !(env.TRANSLATION_ENGINE !== "google")) {
      replyContent = await GoogleTranslate({ env, text, lang });
    } else if (env.OPENAI_API_KEY && !(env.TRANSLATION_ENGINE !== "chatgpt")) {
      replyContent = await ChatGPTTranslate({ env, text, lang });
    } else {
      throw new Error("No translation engine API Key is found.");
    }

    console.log(JSON.stringify(replyContent));
    if (JSON.parse(replyContent || "{}")?.data?.length) {
      ctx.waitUntil(cache.put(cacheKey, replyContent!));
    }

    return response(replyContent, env);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
