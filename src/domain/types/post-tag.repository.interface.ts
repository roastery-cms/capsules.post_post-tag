import type { PostTag } from "../post-tag";
import type { IUnmountedPostTag } from "./unmounted-post-tag.interface";

export interface IPostTagRepository {
	create(data: PostTag): Promise<void>;
	// findById(id: string): Promise<IUnmountedPostTag | null>;
	findBySlug(slug: string): Promise<IUnmountedPostTag | null>;
	findMany(page: number): Promise<IUnmountedPostTag[]>;
	update(data: PostTag): Promise<void>;
	length(): Promise<number>;
}
