import { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTagRepository } from "@/domain/types";
import { makeFindPostTagUseCase } from "@/infra/factories/application/use-cases";
import { IdOrSlugDTO } from "@caffeine/presentation/dtos";
import Elysia from "elysia";
import { PostTagRepositoryPlugin } from "../plugins";

export function FindPostTagController(repository: IPostTagRepository) {
	return new Elysia()
		.use(PostTagRepositoryPlugin(repository))
		.derive({ as: "local" }, ({ postTagRepository }) => ({
			findPostTag: makeFindPostTagUseCase(postTagRepository),
		}))
		.get(
			"/:id-or-slug",
			({ params, findPostTag }) => findPostTag.run(params["id-or-slug"]),
			{
				params: IdOrSlugDTO,
				detail: {
					summary: "Get Post Tag by ID",
					tags: ["Post Tags"],
					description:
						"Retrieves a specific post tag by its unique identifier.",
				},
				response: UnpackedPostTagDTO,
			},
		);
}
