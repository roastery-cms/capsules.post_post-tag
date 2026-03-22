import { UpdatePostTagDTO } from "@/application/dtos/update-post-tag.dto";
import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeUpdatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { UpdatePostTagQueryParamsDTO } from "../dtos/update-post-tag-query-params.dto";
import { PostTagRepositoryPlugin } from "../plugins";
import type { IControllersWithAuth } from "./types/controllers-with-auth.interface";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { baristaAuth } from "@roastery-capsules/auth/plugins/guards";
import { barista } from "@roastery/barista";
import { IdOrSlugDTO } from "@roastery/seedbed/presentation/dtos";

export function UpdatePostTagController({
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
			updatePostTag: makeUpdatePostTagUseCase(postTagRepository),
		}))
		.patch(
			"/:id-or-slug",
			({ params, body, query, updatePostTag }) =>
				updatePostTag.run(params["id-or-slug"], body, query["update-slug"]),
			{
				params: IdOrSlugDTO,
				body: UpdatePostTagDTO,
				query: UpdatePostTagQueryParamsDTO,
				detail: {
					summary: "Update Post Tag",
					description:
						"Updates an existing post tag with the provided details.",
				},
				response: { 200: UnpackedPostTagDTO },
			},
		);
}
