import { makeGetPostTagsByPageUseCase } from "@/infra/factories/application";
import { PaginationDTO } from "@caffeine/models/dtos";
import { Elysia } from "elysia";

export const GetPostTagsByPageController = new Elysia()
	.decorate("service", makeGetPostTagsByPageUseCase())
	.get(
		"/",
		({ query, service }) => {
			return service.run(query.page);
		},
		{
			query: PaginationDTO,
			detail: {
				summary: "Get Post Tags by Page",
				tags: ["Post Tags"],
				description: "Returns a paginated list of post tags.",
			},
		},
	);
