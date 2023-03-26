export const corsHeaders = (env: any) => {
  return {
    "Access-Control-Allow-Origin": env.CORS || "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Headers": "*",
  };
};

export function getChatGPTPOSTFormat(text: string, lang: string) {
  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
Here's a JSON contain array of objects. 
Translate every "textContent" of the objects inside
the array to language which country's ISO Code is ${lang}
and keep using the same format. You can only reply with a string
format that can be parsed with JSON.parse()

Don't add notes or additional text outside the JSON format
at the end of reply.
`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  };
}

export function response(reply: string, env: any): Response {
  console.log(reply);
  return new Response(reply, {
    headers: { ...corsHeaders(env) },
  });
}
