import { CountPostTasUseCase } from "@/application/use-cases/count-post-tags.use-case";
import { makePostTagRepository } from "@/infra/factories/repositories";

export function makeCountPostTagsUseCase(): CountPostTasUseCase {
	const repository = makePostTagRepository();
	return new CountPostTasUseCase(repository);
}
