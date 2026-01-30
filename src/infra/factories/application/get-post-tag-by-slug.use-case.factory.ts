import { GetPostTagBySlugUseCase } from "@/application/use-cases/get-post-tag-by-slug.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeGetPostTagBySlugUseCase(): GetPostTagBySlugUseCase {
	return new GetPostTagBySlugUseCase(makePostTagRepository());
}
