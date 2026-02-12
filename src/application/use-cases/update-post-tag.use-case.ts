import type { IPostTagWriter } from "@/domain/types/post-tag-writer.interface";
import type { UpdatePostTagDTO } from "../dtos/update-post-tag.dto";
import type { FindPostTagUseCase } from "./find-post-tag.use-case";
import { ResourceNotFoundException } from "@caffeine/errors/application";
import type { IUnpackedPostTag } from "@/domain/types";
import { PostTag } from "@/domain";
import { UnpackPostTagService } from "@/domain/services";
import { InvalidOperationException } from "@caffeine/errors/application";

export class UpdatePostTagUseCase {
	public constructor(
		private readonly writer: IPostTagWriter,
		private readonly findPostTag: FindPostTagUseCase,
	) {}

	public async run(
		_id: string,
		content: UpdatePostTagDTO,
		updateSlug: boolean = false,
	): Promise<IUnpackedPostTag> {
		const _targetPostTag = await this.findPostTag.run(_id);

		if (!_targetPostTag) throw new ResourceNotFoundException("post@post-tag");

		const { id, createdAt, updatedAt, ...properties } = _targetPostTag;

		const targetPostTag = PostTag.make(properties, {
			id,
			createdAt,
			updatedAt,
		});

		if (
			(updateSlug && content.slug) ||
			(content.name && updateSlug && content.slug)
		)
			throw new InvalidOperationException(
				"post@post-tag",
				"You cannot allow slug updates by name slug when you have a slug set to be changed.",
			);

		if (content.name) targetPostTag.rename(content.name);
		if (content.name && updateSlug) targetPostTag.reslug(content.name);
		if (content.slug) targetPostTag.reslug(content.slug);
		if (!!content.hidden) targetPostTag.changeVisibility(content.hidden);

		await this.writer.update(targetPostTag);

		return UnpackPostTagService.run(targetPostTag);
	}
}
