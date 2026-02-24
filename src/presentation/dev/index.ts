import { logger } from "@bogeychan/elysia-logger";
import Elysia from "elysia";
import { PostTagRoutes } from "..";
import { GetAccessController } from "@caffeine/auth/plugins/controllers";
import { CaffeineErrorHandler } from "@caffeine/api-error-handler";
import { CaffeineResponseMapper } from "@caffeine/api-response-mapper";
import { CaffeineApiDocs } from "@caffeine/api-docs";

new Elysia()
	.use(CaffeineErrorHandler)
	.use(CaffeineResponseMapper)
	.use(CaffeineApiDocs)
	.use(logger({ autoLogging: true }))
	.use(GetAccessController)
	.use(PostTagRoutes)
	.listen(8080, () => {
		console.log(`🦊 server is running at: http://localhost:8080`);
	});
