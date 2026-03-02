import type { IPostTagRepository } from "@/domain/types";
import { PostTagRepository as PrismaPostTagRepository } from "@/infra/repositories/prisma";
import { PostTagRepository as CachedPostTagRepository } from "@/infra/repositories/cached";
import type { RepositoryProviderDTO } from "./dtos";
import { PostTagRepository as TestPostTagRepository } from "@/infra/repositories/test";
import type { PrismaClient } from "@caffeine-adapters/post";
import { ResourceNotFoundException } from "@caffeine/errors/infra";
import { EntitySource } from "@caffeine/entity/symbols";
import type { CaffeineCacheInstance } from "@caffeine/cache";
import { PostTag } from "@/domain";

type MakePostTagRepositoryArgs = {
    target?: RepositoryProviderDTO;
    cache: CaffeineCacheInstance;
    prismaClient?: PrismaClient;
};

export function makePostTagRepository({
    cache,
    prismaClient,
    target,
}: MakePostTagRepositoryArgs): IPostTagRepository {
    if (target?.includes("PRISMA") && !prismaClient)
        throw new ResourceNotFoundException(PostTag[EntitySource]);

    const repository: IPostTagRepository =
        target === "PRISMA" && prismaClient
            ? new PrismaPostTagRepository(prismaClient)
            : new TestPostTagRepository();

    return new CachedPostTagRepository(repository, cache);
}
