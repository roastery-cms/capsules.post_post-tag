import { CreatePostTagDTO } from "@/application/dtos/create-post-tag.dto";
import { makeCreatePostTagUseCase } from "@/infra/factories/application";
import { AuthGuard } from "@caffeine/auth/plugins/guards";
import { Elysia } from "elysia";

export const CreatePostTagController = new Elysia()
	.use(AuthGuard({ layerName: "post@post-tag" }))
	.decorate("service", makeCreatePostTagUseCase())
	.post(
		"/",
		({ body, service }) => {
			return service.run(body);
		},
		{
			body: CreatePostTagDTO,
			detail: {
				summary: "Create Post Tag",
				tags: ["Post Tags"],
				description: "Creates a new post tag with the provided details.",
			},
		},
	);
