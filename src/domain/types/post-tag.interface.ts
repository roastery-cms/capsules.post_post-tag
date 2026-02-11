import type { IEntity } from "@caffeine/entity/types";
import type { IRawPostTag } from "./raw-post-tag.interface";

export interface IPostTag extends IEntity, IRawPostTag {
	rename(value: string): void;
	reslug(value: string): void;
	toggleVisibility(): void;
}
