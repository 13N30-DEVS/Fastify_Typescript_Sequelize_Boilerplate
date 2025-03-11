import { FastifyReply, FastifyRequest } from "fastify";

interface Options {
  data?: any;
  headers?: string | undefined;
  customMessage?: string;
  error?: any;
}

export enum responseType {
  OK = "OK",
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  NO_CONTENT = "NO_CONTENT",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_ACCEPTABLE = "NOT_ACCEPTABLE",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  BAD_GATEWAY = "BAD_GATEWAY",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  GATEWAY_TIMEOUT = "GATEWAY_TIMEOUT",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  PRECONDITION_FAILED = "PRECONDITION_FAILED",
  UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
}

const httpStatusCodes: Record<
  string,
  { code: number; description: string; message?: string }
> = {
  OK: {
    code: 200,
    description: "The request has succeeded.",
    message: "SUCCESSFULLY_FETCHED",
  },
  CREATED: {
    code: 201,
    description:
      "The request has been fulfilled, resulting in the creation of a new resource.",
  },
  ACCEPTED: {
    code: 202,
    description:
      "The request has been accepted for processing, but the processing has not been completed.",
  },
  NO_CONTENT: {
    code: 204,
    description:
      "The server has successfully fulfilled the request and there is no additional content to send in the response payload body.",
  },
  BAD_REQUEST: {
    code: 400,
    description: "The server cannot process the request due to a client error.",
  },
  UNAUTHORIZED: {
    code: 401,
    description:
      "The client must authenticate itself to get the requested response.",
  },
  FORBIDDEN: {
    code: 403,
    description:
      "The client does not have permission to access the requested resource.",
  },
  NOT_FOUND: {
    code: 404,
    description: "The requested resource could not be found.",
  },
  NOT_ACCEPTABLE: {
    code: 406,
    description: "The server is unable to produce a response",
  },
  CONFLICT: {
    code: 409,
    description:
      "The server is unable to process the request due to a conflict in the current state of the resource.",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    description:
      "The server has encountered a situation it doesn't know how to handle.",
  },
  NOT_IMPLEMENTED: {
    code: 501,
    description:
      "The server does not support the functionality required to fulfill the request.",
  },
  BAD_GATEWAY: {
    code: 502,
    description:
      "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.",
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    description:
      "The server is not ready to handle the request. Common causes of this error include when the server is down for maintenance or is overloaded.",
  },
};

function handleResponse(
  request: FastifyRequest,
  reply: FastifyReply,
  responseType: responseType,
  options: Options
) {
  const statusInfo = httpStatusCodes[responseType];
  if (!statusInfo) {
    throw new Error(`Invalid response type: ${responseType}`);
  }

  const {
    headers = "application/json",
    data = {},
    error = {},
    customMessage,
  } = options;

  const isErrorResponse = statusInfo.code >= 400;

  reply.code(statusInfo.code).header("Content-Type", headers);
  if (isErrorResponse) {
    return reply.send({
      error: {
        isError: true,
        origin: request.url,
        timestamp: new Date(),
        message: customMessage,
        data,
        ...error,
      },
    });
  } else {
    if (data?.buffer) {
      return reply
        .header("Content-Disposition", `attachment; filename=${data?.fileName}`)
        .type(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        .send(data?.buffer);
    }
    return reply.send({
      ...data,
      meta: {
        message: customMessage
          ? customMessage
          : httpStatusCodes[responseType]["message"],
      },
    });
  }
}

export { handleResponse };
