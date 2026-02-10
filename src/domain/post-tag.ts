import { Entity } from "@caffeine/models";
import type { IPostTag } from "./types";
import { BuildPostTagDTO } from "./dtos/build-post-tag.dto";
import type { EntityDTO } from "@caffeine/models/dtos";
import { InvalidDomainDataException } from "@caffeine/errors/domain";
import { makeEntityFactory } from "@caffeine/models/factories";
import { DefinedStringVO, SlugVO } from "@caffeine/models/value-objects";
import { Schema } from "@caffeine/models/schema";

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

	private constructor(
		initialProperties: BuildPostTagDTO,
		entityProps: EntityDTO,
	) {
		super(entityProps);

		this._name = DefinedStringVO.make(initialProperties.name, {
			name: "name",
			layer: "post@post-tag",
		});

		this._hidden = initialProperties.hidden;

		this._slug = SlugVO.make(initialProperties.slug, {
			name: "slug",
			layer: "post@post-tag",
		});
	}

	public static make(
		initialProperties: BuildPostTagDTO,
		entityProps?: EntityDTO,
	): PostTag {
		if (!Schema.make(BuildPostTagDTO).match(initialProperties))
			throw new InvalidDomainDataException("post@post-tag");

		entityProps = entityProps ?? makeEntityFactory();

		return new PostTag(initialProperties, entityProps);
	}

	public rename(value: string): void {
		this._name = DefinedStringVO.make(value, {
			name: "name",
			layer: "post@post-tag",
		});

		this._slug = SlugVO.make(value, {
			name: "slug",
			layer: "post@post-tag",
		});

		this.update();
	}

	public toggleVisibility(): void {
		this._hidden = !this._hidden;
		this.update();
	}
}
