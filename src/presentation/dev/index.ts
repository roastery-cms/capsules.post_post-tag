import { logger } from "@bogeychan/elysia-logger";
import Elysia from "elysia";
import { PostTagRoutes } from "..";
import openapi from "@elysiajs/openapi";
import { GetAccessController } from "@caffeine/auth/plugins/controllers";
import { CaffeineErrorHandler } from "@caffeine/api-error-handler";

new Elysia()
	.use(CaffeineErrorHandler)
	.use(openapi({ path: "/docs", scalar: { showDeveloperTools: "never" } }))
	.use(logger({ autoLogging: true }))
	.use(GetAccessController)
	.use(PostTagRoutes)
	.listen(8080, () => {
		console.log(`🦊 server is running at: http://localhost:8080`);
	});
