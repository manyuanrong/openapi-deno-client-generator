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
    if (Object.keys(queryParams).length > 0) {
      path += "?" + new URLSearchParams(queryParams).toString();
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
