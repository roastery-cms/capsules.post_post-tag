import { Elysia } from "elysia";
import { CreatePostTagController } from "./controllers/create-post-tag.controller";
import { GetPostTagByIdController } from "./controllers/get-post-tag-by-id.controller";
import { GetPostTagBySlugController } from "./controllers/get-post-tag-by-slug.controller";
import { GetPostTagNumberOfPagesController } from "./controllers/get-post-tag-number-of-pages.controller";
import { GetPostTagsByPageController } from "./controllers/get-post-tags-by-page.controller";
import { TogglePostTagVisibilityController } from "./controllers/toggle-post-tag-visibility.controller";
import { UpdatePostTagController } from "./controllers/update-post-tag.controller";

export const PostTagRoutes = new Elysia({ prefix: "/post-tag" })
	.use(CreatePostTagController)
	.use(GetPostTagByIdController)
	.use(GetPostTagBySlugController)
	.use(GetPostTagNumberOfPagesController)
	.use(GetPostTagsByPageController)
	.use(TogglePostTagVisibilityController)
	.use(UpdatePostTagController);

export type PostTagRoutes = typeof PostTagRoutes;
