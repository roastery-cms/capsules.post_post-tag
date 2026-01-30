import { Entity, Schema } from "@caffeine/models";
import type { IUnmountedPostTag } from "./types/unmounted-post-tag.interface";
import type { IPostTag } from "./types";
import { BuildPostTagDTO } from "./dtos/build-post-tag.dto";
import type { EntityDTO } from "@caffeine/models/dtos";
import { InvalidDomainDataException } from "@caffeine/errors/domain";
import { makeEntityFactory } from "@caffeine/models/factories";

export class PostTag extends Entity<IUnmountedPostTag> implements IPostTag {
	public name: string;
	public slug: string;
	public hidden: boolean;

	private constructor(
		initialProperties: BuildPostTagDTO,
		entityProps: EntityDTO,
	) {
		super(entityProps);

		this.name = initialProperties.name;
		this.hidden = initialProperties.hidden;
		this.slug = initialProperties.slug;
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

	public override unpack(): IUnmountedPostTag {
		const { unpack: _, ...content } = this;

		return content;
	}
}
