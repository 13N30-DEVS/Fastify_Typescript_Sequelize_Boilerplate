import { FastifyPluginAsync } from "fastify";
// import { schema } from "./schema";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request: any, reply: any) {
    // return reply.send({});
    return { message: "This is a public endpoint" };
  });
};

export default example;
