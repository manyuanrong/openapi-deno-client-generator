import {
  isReferenceObject,
  type OpenAPIObject,
  type OperationObject,
  type PathsObject,
  type ReferenceObject,
  type SchemaObject,
} from "npm:openapi3-ts@4.4.0/oas31";
import { formatCode } from "./format.ts";
import { TEMPLATE_CODE } from "./template-client.ts";

export function getSchemaObjectCode(
  schemaObject: SchemaObject | ReferenceObject,
  indent = 0
) {
  let code = "";
  if (isReferenceObject(schemaObject)) {
    code = schemaObject.$ref.replace("#/components/schemas/", "");
  } else if (schemaObject.type === "object" && schemaObject.properties) {
    code = `{\n`;
    for (const key in schemaObject.properties) {
      let propName = key;
      if (key.includes("-")) {
        propName = `"${key}"`;
      }
      const property = schemaObject.properties[key];
      const required = schemaObject.required?.includes(key) ?? false;
      code += `${" ".repeat(indent + 2)}${propName}${
        required ? "" : "?"
      }: ${getSchemaObjectCode(property, indent + 2)};\n`;
    }
    code += " ".repeat(indent) + "}";
  } else if (schemaObject.type === "array" && schemaObject.items) {
    code = `${getSchemaObjectCode(schemaObject.items, indent)}[]`;
  } else {
    code = schemaObject.type ? `${schemaObject.type}` : "any";
  }
  return code;
}

export function getSchemaTypesCode(schemas: {
  [schema: string]: SchemaObject | ReferenceObject;
}) {
  const code: string[] = [];
  for (const key in schemas) {
    code.push(`export interface ${key} ${getSchemaObjectCode(schemas[key])};`);
  }
  return code.join("\n\n");
}

export function getSchemaClientCode(paths: PathsObject) {
  const apiCodes: string[] = [];
  for (const path in paths) {
    const api = paths[path];
    for (const method in api) {
      const operation = api[method as any] as OperationObject;
      const operationName = operation.operationId!.split(".").pop();

      let code = "";
      let body = "";
      let summary = "";
      let responseType = "any";
      const pathParams: {
        name: string;
        type: string;
        required: boolean;
      }[] = [];
      const queryParams: typeof pathParams = [];

      if (operation.summary) {
        summary = `  /**\n   * ${operation.summary}\n   */\n`;
      }

      if (operation.parameters) {
        for (const parameter of operation.parameters) {
          if (!isReferenceObject(parameter) && parameter.in === "path") {
            pathParams.push({
              name: parameter.name!,
              required: parameter.required ?? false,
              type: getSchemaObjectCode(parameter.schema as SchemaObject),
            });
          } else if (
            !isReferenceObject(parameter) &&
            parameter.in === "query"
          ) {
            queryParams.push({
              name: parameter.name!,
              required: parameter.required ?? false,
              type: getSchemaObjectCode(parameter.schema as SchemaObject),
            });
          }
        }
      }

      if (operation.requestBody) {
        if (isReferenceObject(operation.requestBody)) {
          body = operation.requestBody.$ref.replace(
            "#/components/schemas/",
            ""
          );
        } else {
          body = getSchemaObjectCode(
            operation.requestBody.content["application/json"]?.schema ?? {}
          );
        }
      }

      if (
        operation.responses?.default ||
        operation.responses?.["200"] ||
        operation.responses?.["201"] ||
        operation.responses?.["204"]
      ) {
        const response =
          operation.responses?.default ??
          operation.responses?.["200"] ??
          operation.responses?.["201"] ??
          operation.responses?.["204"];
        if (isReferenceObject(response)) {
          responseType = response.$ref.replace("#/components/schemas/", "");
        } else if (response.content?.["application/json"]) {
          responseType = getSchemaObjectCode(
            response.content["application/json"].schema ?? {}
          );
        }
      }

      const allParams = [...pathParams, ...queryParams];
      const paramList = [
        allParams.length
          ? `params: { ${allParams
              .map(
                ({ name, type, required }) =>
                  `${name}${!required ? "?" : ""}: ${type}`
              )
              .join(", ")} }`
          : "",
        body ? "data: " + body : "",
      ]
        .filter((p) => !!p.trim())
        .join(", ");

      code += `${summary}  async ${operationName}(${paramList}): Promise<${responseType}> {
    ${
      allParams.length
        ? `const { ${allParams.map(({ name }) => name).join(", ")} } = params;`
        : ""
    }
    return await this.request(
      "${path}",
      "${method.toUpperCase()}",
      {${pathParams.map(({ name }) => name).join(", ")}},
      {${queryParams.map(({ name }) => name).join(", ")}},
      ${body ? "data" : "{}"}
    );
  };`;
      apiCodes.push(code);
    }
  }

  return TEMPLATE_CODE.replace(
    `public placeholder = "";`,
    "\n" + apiCodes.join("\n\n")
  );
}

export async function generate(spec: OpenAPIObject): Promise<string> {
  const schemas = getSchemaTypesCode(spec.components?.schemas ?? {});
  const client = getSchemaClientCode(spec.paths ?? {});
  const code =
    `/**
 * Generated by https://github.com/manyuanrong/openapi-deno-client-generator
 */\n\n` +
    schemas +
    "\n\n" +
    client;
  return await formatCode(code);
}
