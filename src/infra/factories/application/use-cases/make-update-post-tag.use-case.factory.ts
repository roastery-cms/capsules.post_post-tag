import { UpdatePostTagUseCase } from "@/application/use-cases/update-post-tag.use-case";
import { makePostTagRepository } from "@/infra/factories/repositories";
import { makeFindPostTagUseCase } from "./make-find-post-tag.use-case.factory";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services";

export function makeUpdatePostTagUseCase(): UpdatePostTagUseCase {
	const repository = makePostTagRepository();
	const findPostTag = makeFindPostTagUseCase();
	const uniquenessChecker = makeSlugUniquenessCheckerService();

	return new UpdatePostTagUseCase(repository, findPostTag, uniquenessChecker);
}
