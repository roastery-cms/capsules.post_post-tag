import Elysia from "elysia";
import { PostTagRoutes } from "..";
import openapi from "@elysiajs/openapi";
import { GetAccessController } from "@caffeine/auth/plugins/controllers";

new Elysia()
	.use(openapi({ path: "/docs", scalar: { showDeveloperTools: "never" } }))
	.use(GetAccessController)
	.use(PostTagRoutes)
	.listen(8080, () => {
		console.log(`🦊 server is running at: http://localhost:8080`);
	});
