import { PostTag } from "@/domain";
import {
	makeCountPostTagsUseCase,
	makeFindManyPostTagsUseCase,
} from "@/infra/factories/application/use-cases";
import { EntitySource } from "@caffeine/entity/symbols";
import { PaginationDTO } from "@caffeine/models/dtos/api";
import { Elysia } from "elysia";
import { FindManyPostsResponseDTO } from "../dtos/find-many-posts-response.dto";

const FIND_MANY_POST_TAGS =
	`${PostTag[EntitySource]}:find-many-post-tags` as const;
const COUNT_POST_TAGS = `${PostTag[EntitySource]}:count-post-tags` as const;

export const FindManyPostTagsController = new Elysia()
	.decorate(FIND_MANY_POST_TAGS, makeFindManyPostTagsUseCase())
	.decorate(COUNT_POST_TAGS, makeCountPostTagsUseCase())
	.get(
		"/",
		async (ctx) => {
			const {
				query,
				[FIND_MANY_POST_TAGS]: findManyPostTags,
				[COUNT_POST_TAGS]: countPostTags,
				set,
			} = ctx;

			const { count, totalPages } = await countPostTags!.run();

			set.headers["X-Total-Count"] = String(count);
			set.headers["X-Total-Pages"] = String(totalPages);

			return findManyPostTags!.run(query.page);
		},
		{
			query: PaginationDTO,
			detail: {
				summary: "Get Post Tags by Page",
				tags: ["Post Tags"],
				description: "Returns a paginated list of post tags.",
			},
			response: FindManyPostsResponseDTO,
		},
	);
