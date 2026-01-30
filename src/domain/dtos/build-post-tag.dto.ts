import { t } from "@caffeine/models";

export const BuildPostTagDTO = t.Object(
	{
		name: t.String({
			description: "The name of the post tag.",
			examples: ["Review"],
			minLength: 1,
		}),
		slug: t.String({
			description:
				"The unique slug identifier derived from the name (e.g., 'my-adventures').",
			examples: ["my-adventures"],
		}),
		hidden: t.Boolean({
			description:
				"Indicates whether the post tag is hidden in the user interface.",
		}),
	},
	{
		description: "Data transfer object used for building a post tag entity.",
	},
);

export type BuildPostTagDTO = t.Static<typeof BuildPostTagDTO>;
