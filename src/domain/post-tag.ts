import type { IMakePostTag, IPostTag } from "./types";
import { Entity } from "@caffeine/entity";
import { DefinedStringVO, SlugVO } from "@caffeine/value-objects";
import type { EntityDTO } from "@caffeine/entity/dtos";
import { makeEntityFactory } from "@caffeine/entity/factories";
import { AutoUpdate } from "@caffeine/entity/decorators";
import type { IValueObjectMetadata } from "@caffeine/value-objects/types";
import { UnpackedPostTagDTO } from "./dtos";
import { Schema } from "@caffeine/schema";
// TODO: Atualizar os testes unitários

export class PostTag
	extends Entity<typeof UnpackedPostTagDTO>
	implements IPostTag
{
	public override readonly __schema: Schema<typeof UnpackedPostTagDTO> =
		Schema.make(UnpackedPostTagDTO);
	public override readonly __source: string = "post@post-tag";

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

		this._name = DefinedStringVO.make(name, this.getPropertyContext("name"));

		this._hidden = hidden === true;

		this._slug = SlugVO.make(slug ?? name, this.getPropertyContext("slug"));
	}

	public static make(
		initialProperties: IMakePostTag,
		_entityProps?: EntityDTO,
	): PostTag {
		const entityProps = _entityProps ?? makeEntityFactory();

		Entity.prepare(entityProps);

		return new PostTag(initialProperties, entityProps);
	}

	@AutoUpdate
	public rename(value: string): void {
		this._name = DefinedStringVO.make(value, this.getPropertyContext("name"));
	}

	@AutoUpdate
	public reslug(value: string): void {
		this._slug = SlugVO.make(value, this.getPropertyContext("slug"));
	}

	@AutoUpdate
	public changeVisibility(value: boolean): void {
		this._hidden = value;
	}

	protected override getPropertyContext(
		propertyName: string,
	): IValueObjectMetadata {
		return {
			name: propertyName,
			source: this.__source,
		};
	}
}
