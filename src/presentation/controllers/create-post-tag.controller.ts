import { CreatePostTagDTO } from "@/application/dtos/create-post-tag.dto";
import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeCreatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { AuthGuard } from "@caffeine/auth/plugins/guards";
import { EntitySource } from "@caffeine/entity/symbols";
import { Elysia } from "elysia";

const SERVICE_KEY = `${PostTag[EntitySource]}:create-post-tag` as const;

export const CreatePostTagController = new Elysia()
	.use(AuthGuard({ layerName: PostTag[EntitySource] }))
	.decorate(SERVICE_KEY, makeCreatePostTagUseCase())
	.post("/", ({ [SERVICE_KEY]: service, body }) => service!.run(body), {
		body: CreatePostTagDTO,
		detail: {
			summary: "Create Post Tag",
			tags: ["Post Tags"],
			description: "Creates a new post tag with the provided details.",
		},
		response: UnpackedPostTagDTO,
	});
