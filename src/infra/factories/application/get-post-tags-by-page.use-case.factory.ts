import { GetPostTagsByPageUseCase } from "@/application/use-cases/get-post-tags-by-page.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeGetPostTagsByPageUseCase(): GetPostTagsByPageUseCase {
	return new GetPostTagsByPageUseCase(makePostTagRepository());
}
