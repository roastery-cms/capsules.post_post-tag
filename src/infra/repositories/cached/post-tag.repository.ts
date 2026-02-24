import type { IPostTag } from "@/domain/types/post-tag.interface";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import { redis } from "@caffeine/redis-drive";
import { CachedPostTagMapper } from "./cached-post-tag.mapper";
import { CACHE_EXPIRATION_TIME } from "@caffeine/constants";
import { Mapper } from "@caffeine/entity";
import { PostTag } from "@/domain";
import { EntitySource } from "@caffeine/entity/symbols";

export class PostTagRepository implements IPostTagRepository {
	private cacheExpirationTime: number = CACHE_EXPIRATION_TIME.SAFE;

	constructor(private readonly repository: IPostTagRepository) {}

	async create(postTag: IPostTag): Promise<void> {
		await this.repository.create(postTag);
		await this.invalidateListCache();
	}

	async findById(id: string): Promise<IPostTag | null> {
		const storedPostTag = await redis.get(`${PostTag[EntitySource]}::$${id}`);

		if (storedPostTag)
			return CachedPostTagMapper.run(
				`${PostTag[EntitySource]}::$${id}`,
				storedPostTag,
			);

		const targetPostTag = await this.repository.findById(id);

		if (!targetPostTag) return null;

		await this.cachePostTag(targetPostTag);

		return targetPostTag;
	}

	async findBySlug(slug: string): Promise<IPostTag | null> {
		const storedId = await redis.get(`${PostTag[EntitySource]}::${slug}`);

		if (storedId) {
			const postTag = await this.findById(storedId);

			if (postTag && postTag.slug === slug) return postTag;

			await redis.del(`${PostTag[EntitySource]}::${slug}`);
		}

		const targetPostTag = await this.repository.findBySlug(slug);

		if (!targetPostTag) return null;

		await this.cachePostTag(targetPostTag);

		return targetPostTag;
	}

	async findMany(page: number): Promise<IPostTag[]> {
		const key = `${PostTag[EntitySource]}:page::${page}`;
		const storedIds = await redis.get(key);

		if (storedIds) {
			const ids: string[] = JSON.parse(storedIds);
			return (await this.findManyByIds(ids)).filter(
				(postTag): postTag is IPostTag => postTag !== null,
			);
		}

		const targetPostTags = await this.repository.findMany(page);

		await Promise.all(
			targetPostTags.map((postTag) => this.cachePostTag(postTag)),
		);

		await redis.set(
			key,
			JSON.stringify(targetPostTags.map((postTag) => postTag.id)),
			"EX",
			this.cacheExpirationTime,
		);

		return targetPostTags;
	}

	async findManyByIds(ids: string[]): Promise<Array<IPostTag | null>> {
		if (ids.length === 0) return [];

		const keys = ids.map((id) => `${PostTag[EntitySource]}::$${id}`);
		const cachedValues = await redis.mget(...keys);

		const postTagsMap = new Map<string, IPostTag>();
		const missedIds: string[] = [];

		for (let i = 0; i < ids.length; i++) {
			const id = ids[i];
			if (!id) continue;

			const cached = cachedValues[i];

			if (cached) {
				try {
					const postTag = CachedPostTagMapper.run(
						`${PostTag[EntitySource]}::$${id}`,
						cached,
					);
					postTagsMap.set(id, postTag);
				} catch {
					missedIds.push(id);
				}
			} else {
				missedIds.push(id);
			}
		}

		if (missedIds.length > 0) {
			const fetchedPostTags = await this.repository.findManyByIds(missedIds);

			await Promise.all(
				fetchedPostTags
					.filter((i) => i !== null)
					.map((pt) => {
						postTagsMap.set(pt.id, pt);
						return this.cachePostTag(pt);
					}),
			);
		}

		return ids.map((id) => postTagsMap.get(id) ?? null);
	}

	async update(postTag: IPostTag): Promise<void> {
		const _cachedPostTag = await redis.get(
			`${PostTag[EntitySource]}::$${postTag.id}`,
		);

		if (_cachedPostTag) {
			const cachedPostTag: IPostTag = CachedPostTagMapper.run(
				`${PostTag[EntitySource]}::$${postTag.id}`,
				_cachedPostTag,
			);

			await redis.del(`${PostTag[EntitySource]}::$${cachedPostTag.id}`);
			await redis.del(`${PostTag[EntitySource]}::${cachedPostTag.slug}`);
		}

		await this.repository.update(postTag);

		await this.cachePostTag(postTag);
		await this.invalidateListCache();
	}

	count(): Promise<number> {
		return this.repository.count();
	}

	private async cachePostTag(postTag: IPostTag): Promise<void> {
		const unpacked = Mapper.toDTO(postTag);

		await Promise.all([
			redis.set(
				`${PostTag[EntitySource]}::$${postTag.id}`,
				JSON.stringify(unpacked),
				"EX",
				this.cacheExpirationTime,
			),
			redis.set(
				`${PostTag[EntitySource]}::${postTag.slug}`,
				postTag.id,
				"EX",
				this.cacheExpirationTime,
			),
		]);
	}

	private async invalidateListCache(): Promise<void> {
		const patterns = [`${PostTag[EntitySource]}:page::*`];

		for (const pattern of patterns) {
			let cursor = "0";
			do {
				const [newCursor, keys] = await redis.scan(
					cursor,
					"MATCH",
					pattern,
					"COUNT",
					100,
				);

				cursor = newCursor;

				if (keys.length > 0) {
					await redis.del(...keys);
				}
			} while (cursor !== "0");
		}
	}
}
