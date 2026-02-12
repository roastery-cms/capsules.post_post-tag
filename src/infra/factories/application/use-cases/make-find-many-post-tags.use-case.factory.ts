import { FindManyPostTagsUseCase } from "@/application/use-cases/find-many-post-tags.use-case";
import { makePostTagRepository } from "@/infra/factories/repositories";

export function makeFindManyPostTagsUseCase(): FindManyPostTagsUseCase {
	const repository = makePostTagRepository();
	return new FindManyPostTagsUseCase(repository);
}
