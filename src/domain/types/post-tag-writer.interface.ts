import type { IPostTag } from "./post-tag.interface";

export interface IPostTagWriter {
	create(data: IPostTag): Promise<void>;
	update(data: IPostTag): Promise<void>;
}
