import type { IMakePostTag, IPostTag } from "./types";
import { Entity } from "@caffeine/entity";
import { BooleanVO, DefinedStringVO, SlugVO } from "@caffeine/value-objects";
import type { EntityDTO } from "@caffeine/entity/dtos";
import {
	EntityContext,
	EntitySchema,
	EntitySource,
} from "@caffeine/entity/symbols";
import { makeEntity } from "@caffeine/entity/factories";
import { AutoUpdate } from "@caffeine/entity/decorators";
import type { Schema } from "@caffeine/schema";
import { UnpackedPostTagSchema } from "./schemas";

export class PostTag extends Entity<UnpackedPostTagSchema> implements IPostTag {
	public override readonly [EntitySource]: string = "post@post-tag";
	public static readonly [EntitySource]: string = "post@post-tag";
	public override readonly [EntitySchema]: Schema<UnpackedPostTagSchema> =
		UnpackedPostTagSchema;

	private _name: DefinedStringVO;
	private _slug: SlugVO;
	private _hidden: BooleanVO;

	public get name(): string {
		return this._name.value;
	}

	public get slug(): string {
		return this._slug.value;
	}

	public get hidden(): boolean {
		return this._hidden.value;
	}

	private constructor(
		{ name, hidden, slug }: IMakePostTag,
		entityProps: EntityDTO,
	) {
		super(entityProps);

		this._name = DefinedStringVO.make(name, this[EntityContext]("name"));

		this._hidden = BooleanVO.make(
			hidden === true,
			this[EntityContext]("hidden"),
		);

		this._slug = SlugVO.make(slug ?? name, this[EntityContext]("slug"));
	}

	public static make(
		initialProperties: IMakePostTag,
		_entityProps?: EntityDTO,
	): IPostTag {
		const entityProps = _entityProps ?? makeEntity();

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
		this._hidden = BooleanVO.make(value, this[EntityContext]("hidden"));
	}
}
