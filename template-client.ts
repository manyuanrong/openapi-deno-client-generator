export const TEMPLATE_CODE = `
export class ApiClient {
  constructor(private baseUrl: string, private fetch = globalThis.fetch) {}

  private async request(
    path: string,
    method: string,
    parameters: Record<string, string>,
    body: any
  ): Promise<any> {
    for (const parameter in parameters) {
      path = path.replace("{" + parameter + "}", parameters[parameter]);
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
