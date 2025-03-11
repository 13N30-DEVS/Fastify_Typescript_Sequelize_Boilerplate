import swagger, { SwaggerOptions } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

const swaggerPlugin: FastifyPluginCallback<SwaggerOptions> = async (
  fastify: any,
  options
) => {
  fastify.register(swagger, {
    swagger: {
      info: {
        title: "",
        description: "API documentation",
        version: "1.0.0",
      },
    },
    exposeRoute: true,
  });
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request: any, reply: any, next: any) {
        next();
      },
      preHandler: function (request: any, reply: any, next: () => void) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject: any, request: any, reply: any) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};

export default fp(swaggerPlugin);
