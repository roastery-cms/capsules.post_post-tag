import { UpdatePostTagDTO } from "@/application/dtos/update-post-tag.dto";
import { PostTag } from "@/domain";
import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeUpdatePostTagUseCase } from "@/infra/factories/application/use-cases";
import { CaffeineAuth } from "@caffeine/auth/plugins/guards";
import { EntitySource } from "@caffeine/entity/symbols";
import { IdOrSlugDTO } from "@caffeine/presentation/dtos";
import Elysia from "elysia";
import { UpdatePostTagQueryParamsDTO } from "../dtos/update-post-tag-query-params.dto";
import { PostTagRepositoryPlugin } from "../plugins";
import type { IControllersWithAuth } from "./types/controllers-with-auth.interface";

export function UpdatePostTagController({
    cacheProvider,
    jwtSecret,
    repository,
    redisUrl,
}: IControllersWithAuth) {
    return new Elysia()
        .use(
            CaffeineAuth({
                layerName: PostTag[EntitySource],
                cacheProvider,
                jwtSecret,
                redisUrl,
            }),
        )
        .use(PostTagRepositoryPlugin(repository))
        .derive({ as: "local" }, ({ postTagRepository }) => ({
            updatePostTag: makeUpdatePostTagUseCase(postTagRepository),
        }))
        .patch(
            "/:id-or-slug",
            ({ params, body, query, updatePostTag }) =>
                updatePostTag.run(
                    params["id-or-slug"],
                    body,
                    query["update-slug"],
                ),
            {
                params: IdOrSlugDTO,
                body: UpdatePostTagDTO,
                query: UpdatePostTagQueryParamsDTO,
                detail: {
                    summary: "Update Post Tag",
                    description:
                        "Updates an existing post tag with the provided details.",
                },
                response: { 200: UnpackedPostTagDTO },
            },
        );
}
