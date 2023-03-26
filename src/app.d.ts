// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  type Env = {
    TRANSLATION_ENGINE: "chatgpt" | "google";
    OPENAI_API_KEY: string;
    GCP_API_KEY: string;
    CORS: string;
    BUCKET: KVNamespace;

    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
    //
    // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
    // MY_SERVICE: Fetcher;
  };

  type i18nDataKey = "class" | "textContent";
  interface i18nData {
    class: string;
    textContent: string;
  }

  interface OpenAIChatMessage {
    role: string;
    content: string;
  }

  interface OpenAIReplyAPI {
    id: string;
    object: string;
    created: number;
    choices: {
      index: number;
      message: {
        role: "assistant" | "system" | "user";
        content: string;
      };
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }
}

export {};
