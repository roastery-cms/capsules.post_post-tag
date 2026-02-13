import type { IPostTagWriter } from "@/domain/types/post-tag-writer.interface";
import type { UpdatePostTagDTO } from "../dtos/update-post-tag.dto";
import type { FindPostTagUseCase } from "./find-post-tag.use-case";
import { ResourceNotFoundException } from "@caffeine/errors/application";
import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import { PostTag } from "@/domain";
import {
	InvalidOperationException,
	ResourceAlreadyExistsException,
} from "@caffeine/errors/application";
import { Mapper } from "@caffeine/entity";
import { slugify } from "@caffeine/entity/helpers";
import { EntitySource } from "@caffeine/entity/symbols";
import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";

export class UpdatePostTagUseCase {
	public constructor(
		private readonly writer: IPostTagWriter,
		private readonly findPostTag: FindPostTagUseCase,
		private readonly uniquenessChecker: IPostTagUniquenessCheckerService,
	) {}

	public async run(
		_id: string,
		content: UpdatePostTagDTO,
		updateSlug: boolean = false,
	): Promise<IUnpackedPostTag> {
		const _targetPostTag = await this.findPostTag.run(_id);

		if (!_targetPostTag)
			throw new ResourceNotFoundException(PostTag[EntitySource]);

		const { id, createdAt, updatedAt, ...properties } = _targetPostTag;

		const targetPostTag = PostTag.make(properties, {
			id,
			createdAt,
			updatedAt,
		});

		if (content.name && updateSlug && content.slug)
			throw new InvalidOperationException(
				PostTag[EntitySource],
				"You cannot allow slug updates by name slug when you have a slug set to be changed.",
			);

		if (content.name) targetPostTag.rename(content.name);

		if (content.name && updateSlug) {
			await this.validateSlugUniqueness(targetPostTag, content.name);
			targetPostTag.reslug(content.name);
		}

		if (content.slug) {
			await this.validateSlugUniqueness(targetPostTag, content.slug);
			targetPostTag.reslug(content.slug);
		}

		if (typeof content.hidden === "boolean")
			targetPostTag.changeVisibility(content.hidden);

		await this.writer.update(targetPostTag);

		return Mapper.toDTO(targetPostTag);
	}

	private async validateSlugUniqueness(postTag: IPostTag, value: string) {
		value = slugify(value);
		if (postTag.slug === value) return;

		const hasPostTagWithSameSlug = await this.uniquenessChecker.run(value);

		if (hasPostTagWithSameSlug)
			throw new ResourceAlreadyExistsException(postTag[EntitySource]);
	}
}
