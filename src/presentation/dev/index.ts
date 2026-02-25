import { logger } from "@bogeychan/elysia-logger";
import Elysia from "elysia";
import { GetAccessController } from "@caffeine/auth/plugins/controllers";
import { CaffeineErrorHandler } from "@caffeine/api-error-handler";
import { CaffeineResponseMapper } from "@caffeine/api-response-mapper";
import { CaffeineApiDocs } from "@caffeine/api-docs";
import { PostTagRoutes } from "../routes";
import { makePostTagRepository } from "@/infra/factories/repositories";

new Elysia()
	.use(CaffeineResponseMapper)
	.use(CaffeineApiDocs())
	.use(CaffeineErrorHandler)
	.use(logger({ autoLogging: true }))
	.use(GetAccessController)
	.use(PostTagRoutes(makePostTagRepository()))
	.listen(8080, () => {
		console.log(`🦊 server is running at: http://localhost:8080`);
	});
