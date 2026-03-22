import { EntityDTO } from "@roastery/beans/entity/dtos";
import { t } from "@roastery/terroir";

export const UnpackedPostTagDTO = t.Composite(
	[
		t.Object(
			{
				name: t.String({
					description: "The name of the post tag.",
					examples: ["Review"],
					minLength: 1,
				}),
				slug: t.String({
					description: "The unique slug identifier of the post tag.",
					examples: ["my-cool-tag"],
					minLength: 1,
				}),
				hidden: t.Boolean({
					description:
						"Indicates whether the post tag is hidden in the user interface.",
				}),
			},
			{
				description:
					"Data transfer object used for building a post tag entity.",
			},
		),
		EntityDTO,
	],
	{
		description:
			"Data transfer object representing a complete post tag entity in its serialized form. Combines the build properties (name, slug, hidden) with entity metadata (id, createdAt, updatedAt).",
	},
);

export type UnpackedPostTagDTO = t.Static<typeof UnpackedPostTagDTO>;
