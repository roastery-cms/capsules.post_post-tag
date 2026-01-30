import type { PostTag } from "@/domain/post-tag";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { redis } from "@caffeine/redis-drive";

export class PostTagRepository implements IPostTagRepository {
	private postTagCacheExpirationTime: number = 60 * 60;

	public constructor(private readonly repository: IPostTagRepository) {}

	async create(data: PostTag): Promise<void> {
		await this.repository.create(data);

		await this.invalidateListCache();
	}

	async findBySlug(slug: string): Promise<IUnmountedPostTag | null> {
		const storedPostTag = await redis.get(`post@post-tag::${slug}`);

		if (storedPostTag)
			return storedPostTag === null ? null : JSON.parse(storedPostTag);

		const targetPostTag = await this.repository.findBySlug(slug);

		if (!targetPostTag) return null;

		await redis.set(
			`post@post-tag::${slug}`,
			JSON.stringify(targetPostTag),
			"EX",
			this.postTagCacheExpirationTime,
		);

		return targetPostTag;
	}

	async findMany(page: number): Promise<IUnmountedPostTag[]> {
		const storedPostTag = await redis.get(`post@post-tag:page::${page}`);

		if (storedPostTag) return JSON.parse(storedPostTag);

		const targetPostTag = await this.repository.findMany(page);

		await redis.set(
			`post@post-tag:page::${page}`,
			JSON.stringify(targetPostTag),
			"EX",
			this.postTagCacheExpirationTime,
		);

		return targetPostTag;
	}

	async update(data: PostTag): Promise<void> {
		await redis.del(`post@post-tag::${data.slug}`);

		await this.repository.update(data);

		await redis.set(
			`post@post-tag::${data.slug}`,
			JSON.stringify(data.unpack()),
			"EX",
			this.postTagCacheExpirationTime,
		);

		await this.invalidateListCache();
	}

	length(): Promise<number> {
		return this.repository.length();
	}

	private async invalidateListCache(): Promise<void> {
		const keys = await redis.keys("post@post-tag:page:*");

		if (keys.length > 0) await redis.del(...keys);
	}
}
