import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeFindPostTagUseCase } from "@/infra/factories/application/use-cases";
import { EntitySource } from "@caffeine/entity/symbols";
import { IdOrSlugDTO } from "@caffeine/presentation";
import { Elysia } from "elysia";

const SERVICE_NAME = `${PostTag[EntitySource]}:find-post-tag`;

export const FindPostTagController = new Elysia()
	.decorate(SERVICE_NAME, makeFindPostTagUseCase())
	.get(
		"/:id-or-slug",
		({ params, [SERVICE_NAME]: service }) => service!.run(params["id-or-slug"]),
		{
			params: IdOrSlugDTO,
			detail: {
				summary: "Get Post Tag by ID",
				tags: ["Post Tags"],
				description: "Retrieves a specific post tag by its unique identifier.",
			},
			response: UnpackedPostTagDTO,
		},
	);
