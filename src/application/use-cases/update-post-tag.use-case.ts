import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { UpdatePostTagDTO } from "../dtos/update-post-tag.dto";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { ResourceNotFoundException } from "@caffeine/errors/application";
import { slugify } from "@caffeine/models/helpers";
import { BuildPostTag } from "@/domain/services/build-post-tag.service";

export class UpdatePostTagUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(
		slug: string,
		content: UpdatePostTagDTO,
	): Promise<IUnmountedPostTag> {
		const _targetPostTag = await this.repository.findBySlug(slug);

		if (!_targetPostTag) throw new ResourceNotFoundException("post@post-tag");

		const targetPostTag = BuildPostTag.run(_targetPostTag);

		if (content.name || content.hidden)
			targetPostTag.updatedAt = new Date().toISOString();

		if (content.name) {
			const slug = slugify(content.name);

			targetPostTag.name = content.name;
			targetPostTag.slug = slug;
		}

		if (content.hidden) targetPostTag.hidden = content.hidden;

		await this.repository.update(targetPostTag);

		return targetPostTag.unpack();
	}
}
