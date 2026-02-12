import { FindPostTagUseCase } from "@/application/use-cases/find-post-tag.use-case";
import { makePostTagRepository } from "@/infra/factories/repositories";
import { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";

export function makeFindPostTagUseCase(): FindPostTagUseCase {
	const repository = makePostTagRepository();
	const findEntityByType = new FindEntityByTypeUseCase(repository);
	return new FindPostTagUseCase(findEntityByType);
}
