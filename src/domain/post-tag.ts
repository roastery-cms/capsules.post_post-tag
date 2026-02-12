import type { IMakePostTag, IPostTag } from "./types";
import { Entity } from "@caffeine/entity";
import { DefinedStringVO, SlugVO } from "@caffeine/value-objects";
import type { EntityDTO } from "@caffeine/entity/dtos";
import {
	EntityContext,
	EntitySchema,
	EntitySource,
} from "@caffeine/entity/symbols";
import { makeEntity } from "@caffeine/entity/factories";
import { AutoUpdate } from "@caffeine/entity/decorators";
import type { IValueObjectMetadata } from "@caffeine/value-objects/types";
import type { Schema } from "@caffeine/schema";
import { UnpackedPostTagSchema } from "./schemas";

export class PostTag extends Entity<UnpackedPostTagSchema> implements IPostTag {
	public override readonly [EntitySource]: string = "post@post-tag";
	public override readonly [EntitySchema]: Schema<UnpackedPostTagSchema> =
		UnpackedPostTagSchema;

	private _name: DefinedStringVO;
	private _slug: SlugVO;
	private _hidden: boolean;

	public get name(): string {
		return this._name.value;
	}

	public get slug(): string {
		return this._slug.value;
	}

	public get hidden(): boolean {
		return this._hidden;
	}

	private constructor(
		{ name, hidden, slug }: IMakePostTag,
		entityProps: EntityDTO,
	) {
		super(entityProps);

		this._name = DefinedStringVO.make(name, this[EntityContext]("name"));

		this._hidden = hidden === true;

		this._slug = SlugVO.make(slug ?? name, this[EntityContext]("slug"));
	}

	public static make(
		initialProperties: IMakePostTag,
		_entityProps?: EntityDTO,
	): IPostTag {
		const entityProps = _entityProps ?? makeEntity();

		Entity.prepare(entityProps);

		return new PostTag(initialProperties, entityProps);
	}

	@AutoUpdate
	public rename(value: string): void {
		this._name = DefinedStringVO.make(value, this[EntityContext]("name"));
	}

	@AutoUpdate
	public reslug(value: string): void {
		this._slug = SlugVO.make(value, this[EntityContext]("slug"));
	}

	@AutoUpdate
	public changeVisibility(value: boolean): void {
		this._hidden = value;
	}

	public override [EntityContext](name: string): IValueObjectMetadata {
		return {
			name,
			source: this[EntitySource],
		};
	}
}
