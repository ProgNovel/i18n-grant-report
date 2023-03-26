import { translateEndpointHandle } from "./workers/handle-translate";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);

    if (url.pathname === "/translate") {
      return translateEndpointHandle(request, env, ctx);
    }

    return new Response("Endpoint not found", {
      status: 404,
    });
  },
};
