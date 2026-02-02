import { UpdatePostTagDTO } from "@/application/dtos/update-post-tag.dto";
import { makeUpdatePostTagUseCase } from "@/infra/factories/application";
import { AuthGuard } from "@caffeine/auth/plugins/guards";
import { SlugObjectDTO } from "@caffeine/models/dtos";
import { Elysia } from "elysia";

export const UpdatePostTagController = new Elysia()
	.use(AuthGuard({ layerName: "post@post-tag" }))
	.decorate("service", makeUpdatePostTagUseCase())
	.patch(
		"/by-slug/:slug",
		({ params, body, service }) => {
			return service.run(params.slug, body);
		},
		{
			params: SlugObjectDTO,
			body: UpdatePostTagDTO,
			detail: {
				summary: "Update Post Tag",
				tags: ["Post Tags"],
				description: "Updates an existing post tag with the provided details.",
			},
		},
	);
