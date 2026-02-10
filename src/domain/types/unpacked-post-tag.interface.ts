import type { IEntity } from "@caffeine/models/types";

export interface IUnpackedPostTag extends IEntity {
	name: string;
	slug: string;
	hidden: boolean;
}
