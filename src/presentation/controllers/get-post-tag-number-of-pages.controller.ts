import { makeGetPostTagNumberOfPagesUseCase } from "@/infra/factories/application";
import { Elysia } from "elysia";

export const GetPostTagNumberOfPagesController = new Elysia()
	.decorate("service", makeGetPostTagNumberOfPagesUseCase())
	.get(
		"/number-of-pages",
		({ service }) => {
			return service.run();
		},
		{
			detail: {
				summary: "Get Number of Pages",
				tags: ["Post Tags"],
				description:
					"Returns the total number of pages for post tags pagination.",
			},
		},
	);
