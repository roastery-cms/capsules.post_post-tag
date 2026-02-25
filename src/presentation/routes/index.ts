import type { IPostTagRepository } from "@/domain/types";
import Elysia from "elysia";
import { EntitySource } from "@caffeine/entity/symbols";
import { PostTag } from "@/domain";
import {
	CreatePostTagController,
	FindManyPostTagsController,
	FindPostTagController,
	UpdatePostTagController,
} from "../controllers";

export function PostTagRoutes(repository: IPostTagRepository) {
	return new Elysia({
		prefix: "/post-tag",
		tags: ["Post Tag"],
		name: PostTag[EntitySource],
	})
		.use(CreatePostTagController(repository))
		.use(FindPostTagController(repository))
		.use(FindManyPostTagsController(repository))
		.use(UpdatePostTagController(repository));
}
