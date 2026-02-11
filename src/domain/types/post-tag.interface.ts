import type { IEntity } from "@caffeine/entity/types";

export interface IPostTag extends IEntity {
	readonly name: string;
	readonly slug: string;
	readonly hidden: boolean;

	rename(value: string, reslug?: boolean): void;
	reslug(value: string): void;
	toggleVisibility(): void;
}
