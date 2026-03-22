import type { IRawPostTag } from "./raw-post-tag.interface";
import type { UnpackedPostTagDTO } from "../dtos";
import type { IEntity } from "@roastery/beans/entity/types";

export interface IPostTag
	extends IEntity<typeof UnpackedPostTagDTO>,
		IRawPostTag {
	rename(value: string): void;
	reslug(value: string): void;
	changeVisibility(value: boolean): void;
}
