import { EntityDTO } from "@caffeine/entity/dtos";
import { t } from "@caffeine/models";
import { SlugDTO } from "@caffeine/models/dtos/primitives";

export const UnpackedPostTagDTO = t.Composite(
	[
		t.Object(
			{
				name: t.String({
					description: "The name of the post tag.",
					examples: ["Review"],
					minLength: 1,
				}),
				slug: SlugDTO,
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
