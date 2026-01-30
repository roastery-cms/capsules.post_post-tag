import { makeTogglePostTagVisibilityUseCase } from "@/infra/factories/application";
import { AuthGuard } from "@caffeine/auth/plugins/guards";
import { SlugObjectDTO } from "@caffeine/models/dtos";
import { Elysia } from "elysia";

export const TogglePostTagVisibilityController = new Elysia()
	.use(AuthGuard({ layerName: "post@post-tag" }))
	.decorate("service", makeTogglePostTagVisibilityUseCase())
	.patch(
		"/:slug/toggle-visibility",
		({ params, service }) => {
			return service.run(params.slug);
		},
		{
			params: SlugObjectDTO,
			detail: {
				summary: "Toggle Post Tag Visibility",
				tags: ["Post Tags"],
				description: "Toggles the visibility status of a specific post tag.",
			},
		},
	);
