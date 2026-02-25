import { UpdatePostTagUseCase } from "@/application/use-cases/update-post-tag.use-case";
import { makeFindPostTagUseCase } from "./make-find-post-tag.use-case.factory";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services";
import type { IPostTagRepository } from "@/domain/types";

export function makeUpdatePostTagUseCase(
	repository: IPostTagRepository,
): UpdatePostTagUseCase {
	const findPostTag = makeFindPostTagUseCase(repository);
	const uniquenessChecker = makeSlugUniquenessCheckerService(repository);

	return new UpdatePostTagUseCase(repository, findPostTag, uniquenessChecker);
}
