import { CreatePostTagUseCase } from "@/application/use-cases/create-post-tag.use-case";
import { makePostTagRepository } from "@/infra/factories/repositories";
import { makeSlugUniquenessCheckerService } from "@/infra/factories/domain/services";

export function makeCreatePostTagUseCase(): CreatePostTagUseCase {
	const repository = makePostTagRepository();

	return new CreatePostTagUseCase(
		repository,
		makeSlugUniquenessCheckerService(),
	);
}
