import { CreatePostTagUseCase } from "@/application/use-cases/create-post-tag.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeCreatePostTagUseCase(): CreatePostTagUseCase {
	return new CreatePostTagUseCase(makePostTagRepository());
}
