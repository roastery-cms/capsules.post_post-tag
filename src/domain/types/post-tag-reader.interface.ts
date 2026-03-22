import type {
	ICanReadId,
	ICanReadSlug,
} from "@roastery/seedbed/domain/types/repositories";
import type { UnpackedPostTagSchema } from "../schemas";
import type { IPostTag } from "./post-tag.interface";

export interface IPostTagReader
	extends ICanReadId<UnpackedPostTagSchema, IPostTag>,
		ICanReadSlug<UnpackedPostTagSchema, IPostTag> {
	findMany(page: number): Promise<IPostTag[]>;
	findManyByIds(ids: string[]): Promise<Array<IPostTag | null>>;
	count(): Promise<number>;
}
