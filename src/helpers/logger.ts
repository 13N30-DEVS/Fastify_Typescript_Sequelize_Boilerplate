import { FastifyRequest } from "fastify";

enum Severity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

class Logger {
  private static log(
    severity: Severity,
    message: string,
    error?: Error | false | any,
    request?: FastifyRequest,
    module?: string
  ) {
    const timestamp = new Date().toISOString();

    let logMessage = `\x1b[2m[${timestamp}]`;

    switch (severity) {
      case Severity.INFO:
        logMessage += `\x1b[34m [${severity}]`;
        break;
      case Severity.WARNING:
        logMessage += `\x1b[33m [${severity}]`;
        break;
      case Severity.ERROR:
        logMessage += `\x1b[31m [${severity}]`;
        break;
      default:
        logMessage += ` [${severity}]`;
    }

    if (module) {
      logMessage += `\x1b[36m [${module}]`;
    }

    const requestFormat: any = {
      url: request?.url,
      host: request?.ip,
      method: request?.method,
      hostname: request?.hostname,
      headers: request?.headers,
      body: request?.body,
      query: request?.query,
      params: request?.params,
      ip: request?.ip,
      "X-Forwarded-For": request?.ips,
      protocol: request?.protocol,
    };

    if (request) {
      logMessage += `\x1b[32m [Request: ${JSON.stringify(
        requestFormat,
        null,
        4
      )}]`;
    }

    logMessage += `\x1b[0m ${message}`;

    if (error) {
      logMessage += `\x1b[31m: ${error.message}\x1b[0m`;
    }

    console.log(logMessage);
  }

  static info(request: FastifyRequest, message: string, module?: string) {
    Logger.log(Severity.INFO, message, undefined, request, module);
  }

  static warning(request: FastifyRequest, message: string, module?: string) {
    Logger.log(Severity.WARNING, message, undefined, request, module);
  }

  static error(
    request: FastifyRequest,
    message: string,
    error?: Error | false | any,
    module?: string
  ) {
    Logger.log(Severity.ERROR, message, error, request, module);
  }
}

export { Logger };
