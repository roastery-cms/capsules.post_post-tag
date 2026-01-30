import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import { PostTagRepository } from "@/infra/repositories/cached";
import { PostTagRepository as PrismaPostTagRepository } from "@/infra/repositories/prisma";

export function makePostTagRepository(): IPostTagRepository {
	return new PostTagRepository(new PrismaPostTagRepository());
}
