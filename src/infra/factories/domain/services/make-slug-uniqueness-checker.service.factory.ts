import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";
import { SlugUniquenessCheckerService } from "@caffeine/domain/services";
import { makePostTagRepository } from "@/infra/factories/repositories";

export function makeSlugUniquenessCheckerService(): IPostTagUniquenessCheckerService {
	const repository = makePostTagRepository();
	return new SlugUniquenessCheckerService(repository);
}
