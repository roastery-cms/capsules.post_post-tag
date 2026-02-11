import type { IMakePostTag, IPostTag } from "./types";
import Entity from "@caffeine/entity";
import { DefinedStringVO, SlugVO } from "@caffeine/value-objects";
import type { EntityDTO } from "@caffeine/entity/dtos";
import { makeEntityFactory } from "@caffeine/entity/factories";
import { AutoUpdate } from "@caffeine/entity/decorators";

export class PostTag extends Entity implements IPostTag {
	private _name: DefinedStringVO;
	private _slug: SlugVO;
	private _hidden: boolean;

	public get name() {
		return this._name.value;
	}

	public get slug() {
		return this._slug.value;
	}

	public get hidden() {
		return this._hidden;
	}

	private constructor(initialProperties: IMakePostTag, entityProps: EntityDTO) {
		super(entityProps);

		this._name = DefinedStringVO.make(initialProperties.name, {
			name: "name",
			layer: "post@post-tag",
		});

		this._hidden = initialProperties.hidden ?? false;

		this._slug = SlugVO.make(initialProperties.slug ?? initialProperties.name, {
			name: "slug",
			layer: "post@post-tag",
		});
	}

	public static make(
		initialProperties: IMakePostTag,
		initialEntityProps?: EntityDTO,
	): PostTag {
		const entityProps = initialEntityProps ?? makeEntityFactory();

		Entity.prepare(entityProps);

		return new PostTag(initialProperties, entityProps);
	}

	@AutoUpdate
	public rename(value: string): void {
		this._name = DefinedStringVO.make(value, {
			name: "name",
			layer: "post@post-tag",
		});
	}

	@AutoUpdate
	public reslug(value: string): void {
		this._slug = SlugVO.make(value, {
			name: "slug",
			layer: "post@post-tag",
		});
	}

	@AutoUpdate
	public toggleVisibility(): void {
		this._hidden = !this._hidden;
	}
}
