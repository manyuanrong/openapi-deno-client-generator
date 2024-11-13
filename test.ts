import { walk } from "jsr:@std/fs";
import { basename, join } from "jsr:@std/path";
import { generate } from "./generate.ts";

for await (const { path } of walk(join(import.meta.dirname!, "./tests/specs"), {
  exts: [".json"],
})) {
  const spec = await import(`file://` + path, { with: { type: "json" } });
  Deno.test("Generate: " + basename(path), async () => {
    const code = generate(spec.default);
    await Deno.writeTextFile(
      "./tests/outputs/" + basename(path).replace(".json", ".ts"),
      code
    );
  });
}
