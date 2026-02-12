import type { IPostTag } from "./post-tag.interface";
import type { ICanReadId, ICanReadSlug } from "@caffeine/domain";

export interface IPostTagReader
	extends ICanReadId<IPostTag>,
		ICanReadSlug<IPostTag> {
	findMany(page: number): Promise<IPostTag[]>;
	findManyByIds(ids: string[]): Promise<Array<IPostTag | null>>;
	count(): Promise<number>;
}
