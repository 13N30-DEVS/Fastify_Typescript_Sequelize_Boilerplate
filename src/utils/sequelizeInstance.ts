import { Dialect, Sequelize } from "sequelize";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT }: any =
  process.env;

export interface SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  port: number;
  schema: string | "public";
}

let dbConfig: SequelizeOptions = {
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  schema: "public",
};

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    logging: false,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    timezone: "+00:00",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
