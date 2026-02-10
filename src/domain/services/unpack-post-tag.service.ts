import type { IPostTag, IUnpackedPostTag } from "../types";

export const UnpackPostTag = {
	run: ({
		id,
		createdAt,
		updatedAt,
		name,
		slug,
		hidden,
	}: IPostTag): IUnpackedPostTag => {
		return { id, createdAt, updatedAt, name, slug, hidden };
	},
} as const;
