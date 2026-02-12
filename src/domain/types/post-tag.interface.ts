import type { IRawPostTag } from "./raw-post-tag.interface";
import type { IEntity } from "@caffeine/entity/types";
import type { UnpackedPostTagDTO } from "../dtos";

export interface IPostTag
	extends IEntity<typeof UnpackedPostTagDTO>,
		IRawPostTag {
	rename(value: string): void;
	reslug(value: string): void;
	changeVisibility(value: boolean): void;
}
