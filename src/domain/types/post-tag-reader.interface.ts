import type { UnpackedPostTagSchema } from "../schemas";
import type { IPostTag } from "./post-tag.interface";
import type {
	ICanReadId,
	ICanReadSlug,
} from "@caffeine/domain/types/repositories";

export interface IPostTagReader
	extends ICanReadId<UnpackedPostTagSchema, IPostTag>,
		ICanReadSlug<UnpackedPostTagSchema, IPostTag> {
	findMany(page: number): Promise<IPostTag[]>;
	findManyByIds(ids: string[]): Promise<Array<IPostTag | null>>;
	count(): Promise<number>;
}
