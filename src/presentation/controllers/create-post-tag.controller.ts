import { CreatePostTagDTO } from "@/application/dtos/create-post-tag.dto";
import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTagRepository } from "@/domain/types";
import { makeCreatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { CaffeineAuth } from "@caffeine/auth/plugins/guards";
import { EntitySource } from "@caffeine/entity/symbols";
import Elysia from "elysia";
import { PostTagRepositoryPlugin } from "../plugins";

export function CreatePostTagController(repository: IPostTagRepository) {
	return new Elysia()
		.use(
			CaffeineAuth({
				layerName: PostTag[EntitySource],
			}),
		)
		.use(PostTagRepositoryPlugin(repository))
		.derive({ as: "local" }, ({ postTagRepository }) => ({
			createPostType: makeCreatePostTagUseCase(postTagRepository),
		}))
		.post("/", ({ createPostType, body }) => createPostType.run(body), {
			body: CreatePostTagDTO,
			detail: {
				summary: "Create Post Tag",
				tags: ["Post Tags"],
				description: "Creates a new post tag with the provided details.",
			},
			response: { 201: UnpackedPostTagDTO },
		});
}
