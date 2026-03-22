import { PostTag } from "@/domain/post-tag";
import type { IPostTag } from "@/domain/types";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import { PrismaPostTagMapper } from "./prisma-post-tag-mapper";
import type { PrismaClient } from "@roastery-adapters/post";
import { SafePrisma } from "@roastery-adapters/post/decorators";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { Mapper } from "@roastery/beans";
import { MAX_ITEMS_PER_QUERY } from "@roastery/seedbed/constants";

export class PostTagRepository implements IPostTagRepository {
	public constructor(private readonly prisma: PrismaClient) {}

	@SafePrisma(PostTag[EntitySource])
	async create(_data: IPostTag): Promise<void> {
		await this.prisma.postTag.create({ data: Mapper.toDTO(_data) });
	}

	@SafePrisma(PostTag[EntitySource])
	async findById(id: string): Promise<IPostTag | null> {
		const targetPostTag = await this.prisma.postTag.findUnique({
			where: { id },
		});

		if (!targetPostTag) return null;

		return PrismaPostTagMapper.run(targetPostTag);
	}

	@SafePrisma(PostTag[EntitySource])
	async findBySlug(slug: string): Promise<IPostTag | null> {
		const targetPostTag = await this.prisma.postTag.findUnique({
			where: { slug },
		});

		if (!targetPostTag) return null;

		return PrismaPostTagMapper.run(targetPostTag);
	}

	@SafePrisma(PostTag[EntitySource])
	async findMany(page: number): Promise<IPostTag[]> {
		return (
			await this.prisma.postTag.findMany({
				skip: MAX_ITEMS_PER_QUERY * (page - 1),
				take: MAX_ITEMS_PER_QUERY,
				orderBy: [{ createdAt: "asc" }],
			})
		).map((item) => PrismaPostTagMapper.run(item));
	}

	@SafePrisma(PostTag[EntitySource])
	async findManyByIds(ids: string[]): Promise<Array<IPostTag | null>> {
		if (ids.length === 0) return [];

		const tags = await this.prisma.postTag.findMany({
			where: { id: { in: ids } },
		});

		const tagMap = new Map<string, IPostTag>();

		for (const tag of tags) tagMap.set(tag.id, PrismaPostTagMapper.run(tag));

		return ids.map((id) => tagMap.get(id) ?? null);
	}

	@SafePrisma(PostTag[EntitySource])
	async update(_data: IPostTag): Promise<void> {
		const { id, ...data } = Mapper.toDTO(_data);

		await this.prisma.postTag.update({ where: { id }, data });
	}

	@SafePrisma(PostTag[EntitySource])
	count(): Promise<number> {
		return this.prisma.postTag.count();
	}
}
