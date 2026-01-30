import { t } from "@caffeine/models";

export const UpdatePostTagDTO = t.Object({
	name: t.Optional(
		t.String({
			description: "The name of the post tag.",
			examples: ["Review"],
			minLength: 1,
		}),
	),
	hidden: t.Optional(
		t.Boolean({
			description:
				"Indicates whether the post tag is hidden in the user interface.",
		}),
	),
});

export type UpdatePostTagDTO = t.Static<typeof UpdatePostTagDTO>;
