import { parseArgs } from "jsr:@std/cli";
import { generate } from "./generate.ts";

const { spec, out = "./client.ts" } = parseArgs(Deno.args);
let data;

if (spec === undefined) {
  console.error("Please provide a spec url as an argument");
  Deno.exit(1);
}

if (spec.startsWith("http")) {
  data = await (await fetch(spec)).json();
} else {
  data = JSON.parse(await Deno.readTextFile(spec));
}

await Deno.writeTextFile(out, generate(data));
