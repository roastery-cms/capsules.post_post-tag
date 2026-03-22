import { t } from "@roastery/terroir";

export const CreatePostTagDTO = t.Object(
	{
		name: t.String({
			description: "The name of the post tag.",
			examples: ["Review"],
			minLength: 1,
		}),
	},
	{
		description:
			"Data transfer object used for creating a new post tag. Only the name is required; other properties like slug and hidden status are generated automatically.",
	},
);

export type CreatePostTagDTO = t.Static<typeof CreatePostTagDTO>;
