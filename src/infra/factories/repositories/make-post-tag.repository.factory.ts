import type { IPostTagRepository } from "@/domain/types";
import { PostTagRepository as PrismaPostTagRepository } from "@/infra/repositories/prisma";
import { PostTagRepository as CachedPostTagRepository } from "@/infra/repositories/cached";
import type { RepositoryProviderDTO } from "./dtos";
import { PostTagRepository as TestPostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain";
import type { BaristaCacheInstance } from "@roastery-adapters/cache";
import { ResourceNotFoundException } from "@roastery/terroir/exceptions/infra";
import { EntitySource } from "@roastery/beans/entity/symbols";
import type { PrismaClient } from "@roastery-adapters/post";

type MakePostTagRepositoryArgs = {
	target?: RepositoryProviderDTO;
	cache: BaristaCacheInstance;
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
