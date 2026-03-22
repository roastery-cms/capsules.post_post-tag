import type { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";
import type { IPostTag } from "../post-tag.interface";
import type { UnpackedPostTagSchema } from "@/domain/schemas";

export type IPostTagUniquenessCheckerService = SlugUniquenessCheckerService<
	UnpackedPostTagSchema,
	IPostTag
>;
