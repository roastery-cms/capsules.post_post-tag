import type { IPostTagRepository } from "@/domain/types";
import { barista } from "@roastery/barista";

export function PostTagRepositoryPlugin(repository: IPostTagRepository) {
	return barista({
		name: "postTagRepository",
	}).decorate("postTagRepository", repository);
}
