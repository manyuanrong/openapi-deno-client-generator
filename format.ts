export async function formatCode(code: string): Promise<string> {
  const file = await Deno.makeTempFile({ suffix: ".ts" });
  await Deno.writeTextFile(file, code);
  try {
    const command = new Deno.Command(Deno.execPath(), { args: ["fmt", file] });
    await command.output();
    return Deno.readTextFile(file);
  } catch (e) {
    console.log(e);
  }

  return code;
}
