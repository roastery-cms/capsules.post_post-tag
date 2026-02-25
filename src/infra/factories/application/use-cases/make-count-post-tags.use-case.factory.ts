import { CountPostTagsUseCase } from "@/application/use-cases/count-post-tags.use-case";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";

export function makeCountPostTagsUseCase(
	repository: IPostTagReader,
): CountPostTagsUseCase {
	return new CountPostTagsUseCase(repository);
}
