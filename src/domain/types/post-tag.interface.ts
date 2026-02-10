import type { IEntity } from "@caffeine/models/types";

export interface IPostTag extends IEntity {
	readonly name: string;
	readonly slug: string;
	readonly hidden: boolean;

	rename(value: string): void;
	toggleVisibility(): void;
}
