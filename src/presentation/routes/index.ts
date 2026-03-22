import Elysia from "elysia";
import { PostTag } from "@/domain";
import {
	CreatePostTagController,
	FindManyPostTagsController,
	FindPostTagController,
	UpdatePostTagController,
} from "../controllers";
import type { IControllersWithAuth } from "../controllers/types/controllers-with-auth.interface";
import { EntitySource } from "@roastery/beans/entity/symbols";

export function PostTagRoutes(data: IControllersWithAuth) {
	const authControllerArgs = data;
	const unauthControllerArgs = { repository: data.repository };

	return new Elysia({
		prefix: "/post-tags",
		tags: ["Post Tags"],
		name: PostTag[EntitySource],
	})
		.use(CreatePostTagController(authControllerArgs))
		.use(FindPostTagController(unauthControllerArgs))
		.use(FindManyPostTagsController(unauthControllerArgs))
		.use(UpdatePostTagController(authControllerArgs));
}

export type PostTagRoutes = ReturnType<typeof PostTagRoutes>;
