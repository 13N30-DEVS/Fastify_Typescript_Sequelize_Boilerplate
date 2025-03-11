import { initModels } from "@models";
import { sequelize, SequelizeOptions } from "@utils";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { establishCustomRelations } from "../models/customRelations";

declare module "fastify" {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}

const sequelizePlugin: FastifyPluginCallback<SequelizeOptions> = async (
  fastify: any,
  _
) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
    })
    .catch((err: any) => {
      console.error("Unable to connect to the database:", err);
    });

  initModels(sequelize);
  establishCustomRelations(sequelize);
  fastify.decorate("sequelize", sequelize);
};

export default fp(sequelizePlugin);
