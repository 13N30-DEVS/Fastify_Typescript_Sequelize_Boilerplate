import Schema, { JSONSchema } from "fluent-json-schema";

export const commonHeaders = Schema.object()
  .id("commonHeaders")
  .prop(
    "authorization",
    Schema.string().description("The authorization token for authentication.")
  );

export const commonQuerys = Schema.object()
  .id("commonQuerys")
  .additionalProperties(false)
  .prop(
    "offset",
    Schema.number().description(
      "The starting point of the data to be retrieved in the paginated response."
    )
  )
  .prop(
    "limit",
    Schema.number().description(
      "The maximum number of items to be included in a single page of the paginated response."
    )
  )
  .prop(
    "search",
    Schema.string().description(
      "Based on the search value, the number of items will be retrieved in the paginated response."
    )
  );

// Common Response for Schema
export const makeResponseSchema = (response: JSONSchema) => {
  const responseType: Record<string, JSONSchema> = {
    "200": response,
    "400": Schema.object()
      .description("Bad Request")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .valueOf() as JSONSchema,
    "401": Schema.object()
      .description("Un Authorized response")
      .prop(
        "error",
        Schema.object()
          .additionalProperties(true)
          .prop("isError", Schema.boolean())
          .prop("message", Schema.string())
          .prop("origin", Schema.string())
          .prop("timestamp", Schema.string())
      )
      .valueOf() as JSONSchema,
    "409": Schema.object()
      .description("Error Response")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .valueOf() as JSONSchema,
    "500": Schema.object()
      .description("Internal Server Error Response")
      .prop(
        "error",
        Schema.object()
          .prop("data", Schema.object())
          .prop("isError", Schema.boolean())
          .prop("message", Schema.string())
          .prop("origin", Schema.string())
          .prop("timestamp", Schema.string())
      )
      .valueOf() as JSONSchema,
  };
  return responseType;
};
