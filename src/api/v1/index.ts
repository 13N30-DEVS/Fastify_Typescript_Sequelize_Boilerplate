import { FastifyInstance } from "fastify";
import { readdirSync } from "fs";
import * as path from "path";

const routesLoader = (fastify: FastifyInstance, sourceDir: string) => {
  readdirSync(sourceDir, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((item: any) => item.name)
    .forEach(async (item: string) => {
      const routePath = path.resolve(sourceDir, item);
      console.log(`Resolving path: ${routePath}`);

      try {
        const route = await import(routePath);
        if (route?.default) {
          fastify.register(route.default, { prefix: `/api/v1/${item}` });
        } else {
          console.error(`Invalid route: ${routePath}`);
        }
      } catch (error) {
        console.error(`Error loading route: ${routePath}`, error);
      }
    });
};

const routes = (fastify: FastifyInstance, _: any, done: any) => {
  //Routes of Public API
  routesLoader(fastify, path.join(__dirname, "public"));
  //Routes of Private API
  routesLoader(fastify, path.join(__dirname, "private"));

  done();
};

export default routes;
