// @deno-types="npm:@types/koa@^2.15.0"
import type Koa from "npm:koa@^2.15.0";
import { generate } from "./generate.ts";

export function useKoaApiClient(spec: any): Koa.Middleware {
  return (ctx: Koa.Context) => {
    ctx.body = generate(spec);
    ctx.status = 200;
    ctx.type = "application/typescript";
  };
}
