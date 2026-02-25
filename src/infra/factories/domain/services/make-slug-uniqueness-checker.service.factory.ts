import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";
import { SlugUniquenessCheckerService } from "@caffeine/domain/services";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";

export function makeSlugUniquenessCheckerService(
	repository: IPostTagReader,
): IPostTagUniquenessCheckerService {
	return new SlugUniquenessCheckerService(repository);
}
