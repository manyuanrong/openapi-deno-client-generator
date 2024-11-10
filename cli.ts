import { generate } from "./generate.ts";

const specUrl = Deno.args[0];
const encoder = new TextEncoder();
let spec;

if (specUrl === undefined) {
  console.error("Please provide a spec url as an argument");
  Deno.exit(1);
}

if (specUrl.startsWith("http")) {
  spec = await (await fetch(specUrl)).json();
} else {
  spec = JSON.parse(await Deno.readTextFile(specUrl));
}

Deno.stdout.write(encoder.encode(generate(spec)));
