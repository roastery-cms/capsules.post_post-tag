import { GetPostTagByIdUseCase } from "@/application/use-cases/get-post-tag-by-id.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeGetPostTagByIdUseCase(): GetPostTagByIdUseCase {
	return new GetPostTagByIdUseCase(makePostTagRepository());
}
