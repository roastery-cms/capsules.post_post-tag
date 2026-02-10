import type { IPostTag } from "./post-tag.interface";

export interface IPostTagRepository {
	create(data: IPostTag): Promise<void>;
	findById(id: string): Promise<IPostTag | null>;
	findBySlug(slug: string): Promise<IPostTag | null>;
	findMany(page: number): Promise<IPostTag[]>;
	update(data: IPostTag): Promise<void>;
	count(): Promise<number>;
}
