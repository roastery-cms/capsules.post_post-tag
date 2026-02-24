import { FindPostTagUseCase } from "@/application/use-cases/find-post-tag.use-case";
import type { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import { makePostTagRepository } from "@/infra/factories/repositories";
import { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";

export function makeFindPostTagUseCase(): FindPostTagUseCase {
	const repository = makePostTagRepository();
	const findEntityByType = new FindEntityByTypeUseCase<
		typeof UnpackedPostTagDTO,
		IPostTag,
		IPostTagReader
	>(repository);
	return new FindPostTagUseCase(findEntityByType);
}
