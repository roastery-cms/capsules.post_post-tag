import { GetPostTypeNumberOfPagesUseCase } from "@/application/use-cases/get-post-tag-number-of-pages.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeGetPostTagNumberOfPagesUseCase(): GetPostTypeNumberOfPagesUseCase {
	return new GetPostTypeNumberOfPagesUseCase(makePostTagRepository());
}
