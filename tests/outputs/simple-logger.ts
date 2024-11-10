export interface LogInput {
  timestamp: number;
  category: string;
  service: string;
  level: string;
  userId: string;
  conversationId: string;
  processId: string;
  event: string;
  msg?: string;
}

export class ApiClient {
  constructor(private baseUrl: string, private fetch = globalThis.fetch) {
    console.log("init rest rpc client", {
      baseUrl: this.baseUrl,
    });
  }

  private async request<T>(
    path: string,
    method: string,
    parameters: Record<string, string>,
    body: any
  ): Promise<T> {
    for (const parameter in parameters) {
      path = path.replace(`{${parameter}}`, parameters[parameter]);
    }
    const response = await this.fetch(`${this.baseUrl}/${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method != "GET" ? JSON.stringify(body) : undefined,
    });
    if (response.headers.get("content-type")?.includes("application/json")) {
      return await response.json();
    } else {
      return (await response.text()) as T;
    }
  }

  /**
   * Version
   */
  async version(): Promise<void> {
    return await this.request("/api/version", "GET", {}, {});
  }

  /**
   * 发送日志
   */
  async create(data: LogInput): Promise<void> {
    return await this.request("/api/log", "POST", {}, data);
  }
}
