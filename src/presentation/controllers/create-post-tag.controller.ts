import { CreatePostTagDTO } from "@/application/dtos/create-post-tag.dto";
import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeCreatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { PostTagRepositoryPlugin } from "../plugins";
import type { IControllersWithAuth } from "./types/controllers-with-auth.interface";
import { barista } from "@roastery/barista";
import { baristaAuth } from "@roastery-capsules/auth/plugins/guards";
import { EntitySource } from "@roastery/beans/entity/symbols";

export function CreatePostTagController({
	cacheProvider,
	jwtSecret,
	repository,
	redisUrl,
}: IControllersWithAuth) {
	return barista()
		.use(
			baristaAuth({
				layerName: PostTag[EntitySource],
				cacheProvider,
				jwtSecret,
				redisUrl,
			}),
		)
		.use(PostTagRepositoryPlugin(repository))
		.derive({ as: "local" }, ({ postTagRepository }) => ({
			createPostType: makeCreatePostTagUseCase(postTagRepository),
		}))
		.post(
			"/",
			async ({ createPostType, body, status }) => {
				const response = await createPostType.run(body);
				return status(201, response as never);
			},
			{
				body: CreatePostTagDTO,
				detail: {
					summary: "Create Post Tag",
					description: "Creates a new post tag with the provided details.",
				},
				response: { 201: UnpackedPostTagDTO },
			},
		);
}
