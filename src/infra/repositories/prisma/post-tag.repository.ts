import type { PostTag } from "@/domain/post-tag";
import type { IPostTag } from "@/domain/types";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import { prisma } from "@caffeine-packages/post.db.prisma-drive";
import { SafePrisma } from "@caffeine-packages/post.db.prisma-drive/decorators";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";
import { PrismaPostTagMapper } from "./prisma-post-tag-mapper";
import { Mapper } from "@caffeine/entity";

export class PostTagRepository implements IPostTagRepository {
	@SafePrisma("post@post-tag")
	async create(_data: IPostTag): Promise<void> {
		await prisma.postTag.create({ data: Mapper.toDTO(_data) });
	}

	@SafePrisma("post@post-tag")
	async findById(id: string): Promise<IPostTag | null> {
		const targetPostTag = await prisma.postTag.findUnique({ where: { id } });

		if (!targetPostTag) return null;

		return PrismaPostTagMapper.run(targetPostTag);
	}

	@SafePrisma("post@post-tag")
	async findBySlug(slug: string): Promise<IPostTag | null> {
		const targetPostTag = await prisma.postTag.findUnique({
			where: { slug },
		});

		if (!targetPostTag) return null;

		return PrismaPostTagMapper.run(targetPostTag);
	}

	@SafePrisma("post@post-tag")
	async findMany(page: number): Promise<IPostTag[]> {
		return (
			await prisma.postTag.findMany({
				skip: MAX_ITEMS_PER_QUERY * (page - 1),
				take: MAX_ITEMS_PER_QUERY,
				orderBy: [{ createdAt: "asc" }],
			})
		).map((item) => PrismaPostTagMapper.run(item));
	}

	@SafePrisma("post@post-tag")
	async findManyByIds(ids: string[]): Promise<Array<IPostTag | null>> {
		if (ids.length === 0) return [];

		const tags = await prisma.postTag.findMany({
			where: { id: { in: ids } },
		});

		const tagMap = new Map<string, IPostTag>();

		for (const tag of tags) tagMap.set(tag.id, PrismaPostTagMapper.run(tag));

		return ids.map((id) => tagMap.get(id) ?? null);
	}

	@SafePrisma("post@post-tag")
	async update(data: IPostTag): Promise<void> {
		const { id, ...otherData } = Mapper.toDTO(data);

		await prisma.postTag.update({ where: { id }, data: { ...otherData } });
	}

	@SafePrisma("post@post-tag")
	count(): Promise<number> {
		return prisma.postTag.count();
	}
}
