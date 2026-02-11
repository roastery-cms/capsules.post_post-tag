import { PostTag } from "@/domain/post-tag";
import type { IPostTag } from "@/domain/types/post-tag.interface";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnpackedPostTag } from "@/domain/types/unpacked-post-tag.interface";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";

export class PostTagRepository implements IPostTagRepository {
	findManyByIds(ids: string[]): Promise<Array<IPostTag | null>> {
		throw new Error("Method not implemented.");
	}
	private postTags: IUnpackedPostTag[] = [];

	async create(data: PostTag): Promise<void> {
		this.postTags.push({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			name: data.name,
			slug: data.slug,
			hidden: data.hidden,
		});
	}

	async findById(id: string): Promise<IPostTag | null> {
		const targetPostTag = this.postTags.find((tag) => tag.id === id);

		if (!targetPostTag) return null;

		const { id: tagId, createdAt, updatedAt, ...props } = targetPostTag;

		return PostTag.make(props, { id: tagId, createdAt, updatedAt });
	}

	async findBySlug(slug: string): Promise<IPostTag | null> {
		const targetPostTag = this.postTags.find((tag) => tag.slug === slug);

		if (!targetPostTag) return null;

		const { id: tagId, createdAt, updatedAt, ...props } = targetPostTag;

		return PostTag.make(props, { id: tagId, createdAt, updatedAt });
	}

	async findMany(page: number): Promise<IPostTag[]> {
		const skip = MAX_ITEMS_PER_QUERY * page;
		const take = MAX_ITEMS_PER_QUERY;

		return this.postTags.slice(skip, skip + take).map((tag) => {
			const { id: tagId, createdAt, updatedAt, ...props } = tag;
			return PostTag.make(props, { id: tagId, createdAt, updatedAt });
		});
	}

	async update(data: PostTag): Promise<void> {
		const index = this.postTags.findIndex((tag) => tag.id === data.id);

		if (index === -1) return;

		this.postTags[index] = {
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			name: data.name,
			slug: data.slug,
			hidden: data.hidden,
		};
	}

	async count(): Promise<number> {
		return this.postTags.length;
	}

	/**
	 * Clears all stored post tags. Useful for resetting state between tests.
	 */
	clear(): void {
		this.postTags = [];
	}

	/**
	 * Gets all stored post tags. Useful for assertions in tests.
	 */
	getAll(): IUnpackedPostTag[] {
		return [...this.postTags];
	}
}
