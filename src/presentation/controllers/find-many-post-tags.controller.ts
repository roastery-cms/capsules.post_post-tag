import { makeFindManyPostTagsUseCase } from "@/infra/factories/application/use-cases";
import { PaginationDTO } from "@caffeine/models/dtos/api";
import { Elysia } from "elysia";
import { FindManyPostsResponseDTO } from "../dtos/find-many-posts-response.dto";
import type { IPostTagRepository } from "@/domain/types";
import { PostTagRepositoryPlugin } from "../plugins";

export function FindManyPostTagsController(repository: IPostTagRepository) {
	return new Elysia()
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
					tags: ["Post Tags"],
					description: "Returns a paginated list of post tags.",
				},
				response: { 200: FindManyPostsResponseDTO },
			},
		);
}
