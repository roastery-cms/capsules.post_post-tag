import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";

export function makeSlugUniquenessCheckerService(
	repository: IPostTagReader,
): IPostTagUniquenessCheckerService {
	return new SlugUniquenessCheckerService(repository);
}
