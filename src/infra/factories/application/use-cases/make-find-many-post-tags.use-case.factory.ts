import { FindManyPostTagsUseCase } from "@/application/use-cases/find-many-post-tags.use-case";
import type { IPostTagRepository } from "@/domain/types";
import { makeCountPostTagsUseCase } from "./make-count-post-tags.use-case.factory";

export function makeFindManyPostTagsUseCase(
	repository: IPostTagRepository,
): FindManyPostTagsUseCase {
	return new FindManyPostTagsUseCase(
		repository,
		makeCountPostTagsUseCase(repository),
	);
}
