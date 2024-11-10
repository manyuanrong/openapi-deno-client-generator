# OpenAPI to fetch API client

Generate an API client through OpenApi spec, which can be used as a cli or as a middleware to provide a remote client entry that can be directly referenced by Deno

# Use as cli

```sh
deno run -A https://xxx.xxx.xxx/you_spec_json_url > client.ts
```

# Use as Koa middleware

Server side:

```ts
import { useKoaApiClient } from "https://deno.land/x/openapi_client_generator@latest/koa.ts";

const app = new Koa();
const spec = Deno.readFileSync("./spec.json", "utf8");
app.use("/client.ts", useKoaApiClient(spec));
app.listen(3000);
```

Client side:

```ts
import { ApiClient } from "http://127.0.0.1:3000/client.ts";
const client = new ApiClient();
```
