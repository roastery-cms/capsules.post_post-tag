import { makeGetPostTagBySlugUseCase } from "@/infra/factories/application";
import { SlugObjectDTO } from "@caffeine/models/dtos";
import { Elysia } from "elysia";

export const GetPostTagBySlugController = new Elysia()
	.decorate("service", makeGetPostTagBySlugUseCase())
	.get(
		"/:slug",
		({ params, service }) => {
			return service.run(params.slug);
		},
		{
			params: SlugObjectDTO,
			detail: {
				summary: "Get Post Tag by Slug",
				tags: ["Post Tags"],
				description: "Retrieves a specific post tag by its slug identifier.",
			},
		},
	);
