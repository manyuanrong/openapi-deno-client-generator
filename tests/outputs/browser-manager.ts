export interface BrowserLeaseOutput {
  leaseId: string;
  cdp: string;
  "cdp-public": string;
  vnc: string;
  token: string;
  imageVersion: string;
}

export class ApiClient {
  constructor(private baseUrl: string, private fetch = globalThis.fetch) {}

  private async request(
    path: string,
    method: string,
    parameters: Record<string, string>,
    body: any
  ): Promise<any> {
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
      return await response.text();
    }
  }

  /**
   * Version
   */
  async version(): Promise<any> {
    return await this.request("/api/version", "GET", {}, {});
  }

  /**
   * 获取当前实例数量
   */
  async getCount(): Promise<any> {
    return await this.request("/api/count", "GET", {}, {});
  }

  /**
   * 租用实例
   */
  async lease(data: any): Promise<BrowserLeaseOutput> {
    return await this.request("/api/lease", "POST", {}, data);
  }

  /**
   * 续租实例
   */
  async renew(leaseId: string, token: string): Promise<any> {
    return await this.request(
      "/api/lease/{leaseId}/{token}/renew",
      "PUT",
      { leaseId, token },
      {}
    );
  }

  /**
   * 释放实例
   */
  async release(leaseId: string, token: string): Promise<any> {
    return await this.request(
      "/api/lease/{leaseId}/{token}",
      "DELETE",
      { leaseId, token },
      {}
    );
  }
}
