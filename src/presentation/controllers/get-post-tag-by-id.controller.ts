import { makeGetPostTagByIdUseCase } from "@/infra/factories/application";
import { IdObjectDTO } from "@caffeine/models/dtos";
import { Elysia } from "elysia";

export const GetPostTagByIdController = new Elysia()
	.decorate("service", makeGetPostTagByIdUseCase())
	.get(
		"/:id",
		({ params, service }) => {
			return service.run(params.id);
		},
		{
			params: IdObjectDTO,
			detail: {
				summary: "Get Post Tag by ID",
				tags: ["Post Tags"],
				description: "Retrieves a specific post tag by its unique identifier.",
			},
		},
	);
