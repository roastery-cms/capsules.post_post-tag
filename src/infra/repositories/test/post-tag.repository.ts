import type { PostTag } from "@/domain/post-tag";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";

export class PostTagRepository implements IPostTagRepository {
	private postTags: IUnmountedPostTag[] = [];

	async create(data: PostTag): Promise<void> {
		this.postTags.push(data.unpack());
	}

	async findById(id: string): Promise<IUnmountedPostTag | null> {
		const targetPostTag = this.postTags.find((tag) => tag.id === id);

		return targetPostTag ?? null;
	}

	async findBySlug(slug: string): Promise<IUnmountedPostTag | null> {
		const targetPostTag = this.postTags.find((tag) => tag.slug === slug);

		return targetPostTag ?? null;
	}

	async findMany(page: number): Promise<IUnmountedPostTag[]> {
		const skip = MAX_ITEMS_PER_QUERY * page;
		const take = MAX_ITEMS_PER_QUERY;

		return this.postTags.slice(skip, skip + take);
	}

	async update(data: PostTag): Promise<void> {
		const index = this.postTags.findIndex((tag) => tag.id === data.id);

		if (index === -1) return;

		this.postTags[index] = data.unpack();
	}

	async length(): Promise<number> {
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
	getAll(): IUnmountedPostTag[] {
		return [...this.postTags];
	}
}
