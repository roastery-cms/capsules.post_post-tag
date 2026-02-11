import type { IPostTag, IUnpackedPostTag } from "../types";

export const UnpackPostTag = {
	run: ({
		id,
		createdAt,
		updatedAt,
		name,
		slug,
		hidden,
	}: IPostTag): IUnpackedPostTag => ({
		id,
		createdAt,
		hidden,
		name,
		slug,
		updatedAt,
	}),
} as const;
