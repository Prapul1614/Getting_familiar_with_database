import { buildServer } from "./utils/server";
import{ logger } from "./utils/logger";
import{ env } from "./config/env"
//console.log("Hello world")

async function gracefulShutdown({ app }: {
    app: Awaited<ReturnType<typeof buildServer>>;
  }) {
    await app.close();
  } 

async function main(){
    const app = await buildServer();

    app.listen({
        port: env.PORT,
        host: env.HOST
    });

    logger.debug(env, "using env");

    const signals = ["SIGINT", "SIGTERM"];
    for (const signal of signals){
        process.on(signal, () => {
            console.log("Got signal", signal)
            gracefulShutdown({app});
        });
    }

    //console.log("server is running")
    //logger.info(`Server is running at http:/localhost:3000`);

}

main();