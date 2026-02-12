import { t } from "@caffeine/models";
import { SlugDTO } from "@caffeine/models/dtos/primitives";

export const UpdatePostTagDTO = t.Object(
	{
		name: t.Optional(
			t.String({
				description: "The name of the post tag.",
				examples: ["Review"],
				minLength: 1,
			}),
		),
		slug: t.Optional(SlugDTO),
		hidden: t.Optional(
			t.Boolean({
				description:
					"Indicates whether the post tag is hidden in the user interface.",
			}),
		),
	},
	{
		description:
			"Data transfer object used for updating an existing post tag. All properties are optional, allowing partial updates.",
	},
);

export type UpdatePostTagDTO = t.Static<typeof UpdatePostTagDTO>;
