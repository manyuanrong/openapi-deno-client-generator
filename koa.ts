import type { Context, Middleware, Next } from "npm:@types/koa@^2.15.0";
import { generate } from "./generate.ts";

export function useKoaApiClient(path: string, spec: any): Middleware {
  return (ctx: Context, next: Next) => {
    if (ctx.path.toLowerCase().startsWith(path.toLowerCase())) {
      ctx.status = 200;
      ctx.type = "application/typescript";
      ctx.body = generate(spec);
      return true;
    }

    return next();
  };
}
