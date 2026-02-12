import type { SlugUniquenessCheckerService } from "@caffeine/domain/services";
import type { IPostTag } from "../post-tag.interface";
import type { UnpackedPostTagSchema } from "@/domain/schemas";

export type IPostTagUniquenessCheckerService = SlugUniquenessCheckerService<
	UnpackedPostTagSchema,
	IPostTag
>;
