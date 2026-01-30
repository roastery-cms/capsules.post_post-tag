import { UpdatePostTagUseCase } from "@/application/use-cases/update-post-tag.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeUpdatePostTagUseCase(): UpdatePostTagUseCase {
	return new UpdatePostTagUseCase(makePostTagRepository());
}
