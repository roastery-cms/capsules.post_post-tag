import { t } from "@caffeine/models";

export const CreatePostTagDTO = t.Object({
	name: t.String({
		description: "The name of the post tag.",
		examples: ["Review"],
		minLength: 1,
	}),
});

export type CreatePostTagDTO = t.Static<typeof CreatePostTagDTO>;
