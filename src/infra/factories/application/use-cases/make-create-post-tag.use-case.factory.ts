import { CreatePostTagUseCase } from "@/application/use-cases/create-post-tag.use-case";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services";
import type { IPostTagRepository } from "@/domain/types";

export function makeCreatePostTagUseCase(
	repository: IPostTagRepository,
): CreatePostTagUseCase {
	return new CreatePostTagUseCase(
		repository,
		makeSlugUniquenessCheckerService(repository),
	);
}
