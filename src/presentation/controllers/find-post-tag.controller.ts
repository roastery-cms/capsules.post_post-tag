import { UnpackedPostTagDTO } from "@/domain/dtos";
import { makeFindPostTagUseCase } from "@/infra/factories/application/use-cases";
import { IdOrSlugDTO } from "@caffeine/presentation/dtos";
import Elysia from "elysia";
import { PostTagRepositoryPlugin } from "../plugins";
import type { IControllersWithoutAuth } from "./types/controllers-without-auth.interface";

export function FindPostTagController({ repository }: IControllersWithoutAuth) {
    return new Elysia()
        .use(PostTagRepositoryPlugin(repository))
        .derive({ as: "local" }, ({ postTagRepository }) => ({
            findPostTag: makeFindPostTagUseCase(postTagRepository),
        }))
        .get(
            "/:id-or-slug",
            ({ params, findPostTag }) => findPostTag.run(params["id-or-slug"]),
            {
                params: IdOrSlugDTO,
                detail: {
                    summary: "Get Post Tag by ID",
                    description:
                        "Retrieves a specific post tag by its unique identifier.",
                },
                response: { 200: UnpackedPostTagDTO },
            },
        );
}
