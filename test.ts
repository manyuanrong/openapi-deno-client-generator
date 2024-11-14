import { assertEquals } from "jsr:@std/assert";
import { walk } from "jsr:@std/fs";
import { basename, join } from "jsr:@std/path";
import { formatCode } from "./format.ts";
import { generate } from "./generate.ts";

Deno.test("formatCode", async () => {
  const formattedCode = await formatCode(`let a=1;`);
  assertEquals(formattedCode, `let a = 1;\n`);
});

for await (const { path } of walk(join(import.meta.dirname!, "./tests/specs"), {
  exts: [".json"],
})) {
  const spec = await import(`file://` + path, { with: { type: "json" } });
  Deno.test("Generate: " + basename(path), async () => {
    const code = await generate(spec.default);
    await Deno.writeTextFile(
      "./tests/outputs/" + basename(path).replace(".json", ".ts"),
      code
    );
  });
}
