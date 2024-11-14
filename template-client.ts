export const TEMPLATE_CODE = `
export class ApiClient {
  constructor(private baseUrl: string, private fetch = globalThis.fetch) {}

  private async request(
    path: string,
    method: string,
    pathsParams: any,
    queryParams: any,
    body: any
  ): Promise<any> {
    for (const parameter in pathsParams) {
      path = path.replace("{" + parameter + "}", pathsParams[parameter]);
    }
    const query: string[] = [];
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined) {
        if (typeof queryParams[key] === "object") {
          if (Array.isArray(queryParams[key])) {
            for (const item of queryParams[key]) {
              query.push(key + "=" + encodeURIComponent(JSON.stringify(item)));
            }
          } else {
            query.push(
              key + "=" + encodeURIComponent(JSON.stringify(queryParams[key]))
            );
          }
        } else {
          query.push(key + "=" + encodeURIComponent(String(queryParams[key])));
        }
      }
    });
    if (query.length > 0) {
      path += "?" + query.join("&");
    }
    const response = await this.fetch(this.baseUrl + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method != "GET" ? JSON.stringify(body) : undefined,
    });
    if (response.headers.get("content-type")?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  public placeholder = "";
}`;
