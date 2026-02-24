import { t } from "@caffeine/models";

export const UpdatePostTagDTO = t.Object(
	{
		name: t.Optional(
			t.String({
				description: "The name of the post tag.",
				examples: ["Review"],
				minLength: 1,
			}),
		),
		slug: t.Optional(
			t.String({
				description: "The unique slug identifier of the post tag.",
				examples: ["my-cool-tag"],
				minLength: 1,
			}),
		),
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
		minProperties: 1,
	},
);

export type UpdatePostTagDTO = t.Static<typeof UpdatePostTagDTO>;
