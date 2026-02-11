import type { IEntity } from "@caffeine/entity/types";

export interface IUnpackedPostTag extends IEntity {
	name: string;
	slug: string;
	hidden: boolean;
}
