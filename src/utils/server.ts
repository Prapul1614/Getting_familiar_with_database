import fastify from "fastify";
import { logger } from "./logger"
import { applicationRoutes } from "../modules/applications/applications.routes";
import { userRoutes } from "../modules/users/users.routes";

export async function buildServer(){
    const app = fastify({
        logger: logger,
    });
    // register plugins

    // register routes
    app.register(applicationRoutes, { prefix: "/api/applications" });
    app.register(userRoutes, {prefix: "/api/users"});
    return app;
}