import type { PostTag } from "@/domain/post-tag";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import {
	prisma,
	prismaErrorManager,
} from "@caffeine-packages/post.db.prisma-drive";
import { parsePrismaDateTimeToISOString } from "@caffeine-packages/post.db.prisma-drive/helpers";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";

export class PostTagRepository implements IPostTagRepository {
	async create(data: PostTag): Promise<void> {
		try {
			await prisma.postTag.create({ data });
		} catch (err: unknown) {
			prismaErrorManager("post@post-tag", err);
		}
	}

	async findById(id: string): Promise<IUnmountedPostTag | null> {
		const targetPostTag = await prisma.postTag.findUnique({ where: { id } });

		if (!targetPostTag) return null;

		return parsePrismaDateTimeToISOString(targetPostTag);
	}

	async findBySlug(slug: string): Promise<IUnmountedPostTag | null> {
		const targetPostTag = await prisma.postTag.findUnique({
			where: { slug },
		});

		if (!targetPostTag) return null;

		return parsePrismaDateTimeToISOString(targetPostTag);
	}

	async findMany(page: number): Promise<IUnmountedPostTag[]> {
		return (
			await prisma.postTag.findMany({
				skip: MAX_ITEMS_PER_QUERY * page,
				take: MAX_ITEMS_PER_QUERY,
			})
		).map((item) => parsePrismaDateTimeToISOString(item));
	}

	async update(data: PostTag): Promise<void> {
		const { id, ...otherData } = data;

		try {
			await prisma.postTag.update({ where: { id }, data: { ...otherData } });
		} catch (err: unknown) {
			prismaErrorManager("post@post-tag", err);
		}
	}

	length(): Promise<number> {
		return prisma.postTag.count();
	}
}
