import type { Context, Middleware, Next } from "npm:@types/koa@^2.15.0";
import { generate } from "./generate.ts";

export function useKoaApiClient(path: string, spec: any): Middleware {
  let cache = "";
  return async (ctx: Context, next: Next) => {
    if (ctx.path.toLowerCase().startsWith(path.toLowerCase())) {
      cache = cache || (await generate(spec));
      ctx.status = 200;
      ctx.type = "application/typescript";
      ctx.body = cache;
      ctx.set("Content-Encoding", "utf8");
      return true;
    }

    return next();
  };
}
