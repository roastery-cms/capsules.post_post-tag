import type { IEntity } from "@caffeine/models/types";

export interface IUnmountedPostTag extends IEntity {
	name: string;
	slug: string;
	hidden: boolean;
}
