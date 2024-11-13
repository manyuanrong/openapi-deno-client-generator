# OpenAPI to fetch API client

Generate an API client through OpenApi spec, which can be used as a cli or as a
middleware to provide a remote client entry that can be directly referenced by
Deno

# Use as cli

```sh
deno run -A jsr:@imean/openapi-client-generator/cli --spec https://xxx.xxx.xxx/you_spec_json_url --out client.ts
```

# Use as Koa middleware

Server side:

```ts
import { useKoaApiClient } from "jsr:@imean/openapi-client-generator/koa";

const app = new Koa();
const spec = Deno.readTextFileSync("./spec.json");
app.use(useKoaApiClient("/client.ts", spec));
app.listen(3000);
```

Client side:

```ts
import { ApiClient } from "http://127.0.0.1:3000/client.ts?cache=1";
const client = new ApiClient();
```

> ⚠️ The cache query parameter is optional. If the upstream server version
> changes, you can manually modify the cache value. Of course, you can replace
> it with any other parameter name, or you can use "deno cache --reload xxx" to
> update the cache dependency.
