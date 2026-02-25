import Elysia from "elysia";
import type { IPostTagRepository } from "@/domain/types";

export function PostTagRepositoryPlugin(repository: IPostTagRepository) {
	return new Elysia({
		name: "postTagRepository",
	}).decorate("postTagRepository", repository);
}
