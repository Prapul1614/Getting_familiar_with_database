import fastify from "fastify";
import guard from "fastify-guard"
import { logger } from "./logger"
import { applicationRoutes } from "../modules/applications/applications.routes";
import { userRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/role.routes";
import jwt from "jsonwebtoken";


type User = {
    id: string,
    scopes: Array<string>,
    applicationId: string
}

declare module "fastify" {
    interface FastifyRequest {
      user: User;
    }
  }

export async function buildServer(){
    const app = fastify({
        logger: logger,
    });
    // This line added because request.user(in addHook) was giving error
    app.decorateRequest("user", null);

    app.addHook('onRequest', async function(request, reply){
        reply; // Just addinging this line so es lint doesnt give error that defined but not used
        const authHeader = request.headers.authorization;

        if (!authHeader) return;
        try {
            const token = authHeader.replace("Bearer ", "");
            const decoded = jwt.verify(token, "secret") as User;

            console.log("user", decoded);

            request.user = decoded;
        } catch (e) { console.log(e);}
    })

    // register plugins
    app.register(guard,{
        requestProperty: 'user',
        scopeProperty: 'scopes',

        errorHandler:(result, request, reply) => {
            return reply.send("You can't do this")
        }
    })

    // register routes
    app.register(applicationRoutes, { prefix: "/api/applications" });
    app.register(userRoutes, {prefix: "/api/users"});
    app.register(roleRoutes, {prefix: "/api/roles"});
    
    return app;
}