import Elysia from "elysia";
import { EntitySource } from "@caffeine/entity/symbols";
import { PostTag } from "@/domain";
import {
    CreatePostTagController,
    FindManyPostTagsController,
    FindPostTagController,
    UpdatePostTagController,
} from "../controllers";
import type { IControllersWithAuth } from "../controllers/types/controllers-with-auth.interface";

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
