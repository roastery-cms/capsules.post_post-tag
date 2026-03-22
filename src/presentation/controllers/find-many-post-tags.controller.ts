import { makeFindManyPostTagsUseCase } from "@/infra/factories/application/use-cases";
import { FindManyPostsResponseDTO } from "../dtos/find-many-posts-response.dto";
import { PostTagRepositoryPlugin } from "../plugins";
import type { IControllersWithoutAuth } from "./types/controllers-without-auth.interface";
import { PaginationDTO } from "@roastery/seedbed/presentation/dtos";
import { barista } from "@roastery/barista";

export function FindManyPostTagsController({
	repository,
}: IControllersWithoutAuth) {
	return barista()
		.use(PostTagRepositoryPlugin(repository))
		.derive({ as: "local" }, ({ postTagRepository }) => ({
			findManyPostTags: makeFindManyPostTagsUseCase(postTagRepository),
		}))
		.get(
			"/",
			async (ctx) => {
				const { query, findManyPostTags, set, status } = ctx;

				const { count, totalPages, value } = await findManyPostTags.run(
					query.page,
				);

				set.headers["X-Total-Count"] = String(count);
				set.headers["X-Total-Pages"] = String(totalPages);

				return status(200, value);
			},
			{
				query: PaginationDTO,
				detail: {
					summary: "Get Post Tags by Page",
					description: "Returns a paginated list of post tags.",
				},
				response: { 200: FindManyPostsResponseDTO },
			},
		);
}
