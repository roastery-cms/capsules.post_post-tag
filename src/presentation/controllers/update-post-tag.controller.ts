import { UpdatePostTagDTO } from "@/application/dtos/update-post-tag.dto";
import { PostTag } from "@/domain";
import { makeUpdatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { CaffeineAuth } from "@caffeine/auth/plugins/guards";
import { EntitySource } from "@caffeine/entity/symbols";
import { IdOrSlugDTO } from "@caffeine/presentation";
import { Elysia } from "elysia";
import { UpdatePostTagQueryParamsDTO } from "../dtos/update-post-tag-query-params.dto";
import { UnpackedPostTagDTO } from "@/domain/dtos";

const SERVICE_NAME = `${PostTag[EntitySource]}:update-post-tag`;

export const UpdatePostTagController = new Elysia()
	.use(
		CaffeineAuth({
			layerName: PostTag[EntitySource],
		}),
	)
	.decorate(SERVICE_NAME, makeUpdatePostTagUseCase())
	.patch(
		"/:id-or-slug",
		({ params, body, query, [SERVICE_NAME]: service }) =>
			service!.run(params["id-or-slug"], body, query["update-slug"]),
		{
			params: IdOrSlugDTO,
			body: UpdatePostTagDTO,
			query: UpdatePostTagQueryParamsDTO,
			detail: {
				summary: "Update Post Tag",
				tags: ["Post Tags"],
				description: "Updates an existing post tag with the provided details.",
			},
			response: UnpackedPostTagDTO,
		},
	);
