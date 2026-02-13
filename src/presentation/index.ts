import { Elysia } from "elysia";
import {
	CreatePostTagController,
	FindManyPostTagsController,
	FindPostTagController,
	UpdatePostTagController,
} from "./controllers";

export const PostTagRoutes = new Elysia({ prefix: "/post-tag" })
	.use(CreatePostTagController)
	.use(FindPostTagController)
	.use(FindManyPostTagsController)
	.use(UpdatePostTagController);

export type PostTagRoutes = typeof PostTagRoutes;
