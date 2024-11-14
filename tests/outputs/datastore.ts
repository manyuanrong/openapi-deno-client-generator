/**
 * Generated by https://github.com/manyuanrong/openapi-deno-client-generator
 */

export interface Column {
  id: string;
  name: string;
  order: number;
  type: string;
}

export interface RowField {
  name: string;
  value: string;
  label?: any;
}

export interface Row {
  id: string;
  createdAt: any;
  updatedAt: any;
  index: number;
  sheetId: string;
  cells: object;
}

export interface Sheet {
  id: string;
  updatedAt?: string;
  conversationId: string;
  structureId: string;
  name: string;
}

export interface SheetSingle {
  columns: Column[];
  id: string;
  updatedAt?: string;
  conversationId: string;
  structureId: string;
  name: string;
}

export interface PaginationInput {
  page?: number;
  size?: number;
}

export interface CreateColumnInput {
  id: string;
  name: string;
  order: number;
  type: string;
}

export interface CreateSheetInput {
  creatorId: string;
  conversationId: string;
  structureId: string;
  name: string;
  columns?: CreateColumnInput[];
}

export interface SearchSheetsInput {
  conversationId?: string;
  keyword?: string;
  structureId?: string;
  page?: number;
  size?: number;
}

export interface FindSheetInput {
  name: string;
  conversationId: string;
  creatorId?: string;
  structureId?: string;
}

export interface CreateCellInput {
  columnId: string;
  value: any;
  label?: string;
  type?: string;
}

export interface InsertRowInput {
  creatorId: string;
  insertAfterId?: string;
  cells?: CreateCellInput[];
}

export interface SearchRowsFilterInput {
  columnId: string;
  value: string;
}

export interface SearchRowsSortInput {
  columnId: string;
  desc: boolean;
}

export interface SearchRowsInput {
  afterIndex?: number;
  filters?: SearchRowsFilterInput[];
  sorter?: SearchRowsSortInput;
  page?: number;
  size?: number;
}

export interface ModifyCellInput {
  value: string;
  type: string;
}

export interface UploadCreateInput {
  creatorId: string;
  conversationId: string;
  structureId: string;
  name: string;
  columns?: CreateColumnInput[];
  overwrite?: boolean;
}

export interface UploadSheetInput {
  bucket?: string;
  key: string;
  creatorId: string;
}

export interface UploadStructureInput {
  columns: CreateColumnInput[];
  name: string;
}

export interface UploadStructureOutput {
  bucket: string;
  key: string;
}

export class ApiClient {
  constructor(private baseUrl: string, private fetch = globalThis.fetch) {}

  private async request(
    path: string,
    method: string,
    pathsParams: any,
    queryParams: any,
    body: any,
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
              key + "=" + encodeURIComponent(JSON.stringify(queryParams[key])),
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

  /**
   * 创建新的表格
   */
  async createSheet(data: CreateSheetInput): Promise<SheetSingle> {
    return await this.request(
      "/datastore/sheets/",
      "POST",
      {},
      {},
      data,
    );
  }

  /**
   * 通过查询参数获取表格列表
   */
  async searchSheets(
    params: {
      conversationId?: string;
      keyword?: string;
      structureId?: string;
      page?: number;
      size?: number;
    },
  ): Promise<Sheet[]> {
    const { conversationId, keyword, structureId, page, size } = params;
    return await this.request(
      "/datastore/sheets/",
      "GET",
      {},
      { conversationId, keyword, structureId, page, size },
      {},
    );
  }

  /**
   * 通过查询参数获取表格
   */
  async findSheetSingle(
    params: {
      name: string;
      conversationId: string;
      creatorId?: string;
      structureId?: string;
    },
  ): Promise<SheetSingle> {
    const { name, conversationId, creatorId, structureId } = params;
    return await this.request(
      "/datastore/sheets/single",
      "GET",
      {},
      { name, conversationId, creatorId, structureId },
      {},
    );
  }

  /**
   * 获取指定的表格
   */
  async getSheetSingle(params: { sheetId: string }): Promise<SheetSingle> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}",
      "GET",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 删除指定的表格
   */
  async deleteSheet(params: { sheetId: string }): Promise<boolean> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}",
      "DELETE",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 获取表格列数据
   */
  async searchColumns(params: { sheetId: string }): Promise<Column[]> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/columns",
      "GET",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 插入一行数据
   */
  async insertRow(
    params: { sheetId: string },
    data: InsertRowInput,
  ): Promise<Row> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/rows",
      "POST",
      { sheetId },
      {},
      data,
    );
  }

  /**
   * 通过查询参数获取多行数据
   */
  async searchRows(
    params: {
      sheetId: string;
      afterIndex?: number;
      filters?: SearchRowsFilterInput[];
      sorter?: SearchRowsSortInput;
      page?: number;
      size?: number;
    },
  ): Promise<Row[]> {
    const { sheetId, afterIndex, filters, sorter, page, size } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/rows",
      "GET",
      { sheetId },
      { afterIndex, filters, sorter, page, size },
      {},
    );
  }

  /**
   * 获取符合条件的总行数
   */
  async countRows(params: { sheetId: string }): Promise<number> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/rows/count",
      "GET",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 获取指定的行
   */
  async getRow(params: { sheetId: string; rowId: string }): Promise<Row> {
    const { sheetId, rowId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/rows/{rowId}",
      "GET",
      { sheetId, rowId },
      {},
      {},
    );
  }

  /**
   * 删除指定的行
   */
  async deleteRow(
    params: { sheetId: string; rowId: string },
  ): Promise<boolean> {
    const { sheetId, rowId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/rows/{rowId}",
      "DELETE",
      { sheetId, rowId },
      {},
      {},
    );
  }

  /**
   * Version
   */
  async version(): Promise<any> {
    return await this.request(
      "/datastore/version",
      "GET",
      {},
      {},
      {},
    );
  }

  /**
   * Create sheet job
   */
  async createSheetJob(): Promise<boolean> {
    return await this.request(
      "/datastore/jobs/",
      "POST",
      {},
      {},
      {},
    );
  }

  /**
   * 下载表格
   */
  async downloadSheetCSV(params: { sheetId: string }): Promise<any> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/download/csv",
      "GET",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 下载表格
   */
  async downloadSheetXLSX(params: { sheetId: string }): Promise<any> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/download/xlsx",
      "GET",
      { sheetId },
      {},
      {},
    );
  }

  /**
   * 上传数据到指定的表格
   */
  async uploadCSVAppend(
    params: { sheetId: string; creatorId: string },
    data: any,
  ): Promise<any> {
    const { sheetId, creatorId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/upload/csv",
      "POST",
      { sheetId },
      { creatorId },
      data,
    );
  }

  /**
   * 上传数据到指定的表格
   */
  async uploadAppendForS3(
    params: { sheetId: string },
    data: UploadSheetInput,
  ): Promise<any> {
    const { sheetId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/upload/s3",
      "POST",
      { sheetId },
      {},
      data,
    );
  }

  /**
   * 上传数据到指定的表格
   */
  async uploadXLSX(
    params: { sheetId: string; creatorId: string },
    data: any,
  ): Promise<any> {
    const { sheetId, creatorId } = params;
    return await this.request(
      "/datastore/sheets/{sheetId}/upload/xlsx",
      "POST",
      { sheetId },
      { creatorId },
      data,
    );
  }

  /**
   * 上传表格结构
   */
  async uploadStructure(
    data: UploadStructureInput,
  ): Promise<UploadStructureOutput> {
    return await this.request(
      "/datastore/sheets/upload/structure",
      "POST",
      {},
      {},
      data,
    );
  }
}
