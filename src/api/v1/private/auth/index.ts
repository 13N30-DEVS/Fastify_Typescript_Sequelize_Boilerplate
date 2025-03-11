import { FastifyPluginAsync } from "fastify";
// import { schema } from "./schema";
const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", {} ,async function (request: any, reply: any) {
    // return reply.send({});
    return { message: "This is a private endpoint" };
  });
};

export default auth;
