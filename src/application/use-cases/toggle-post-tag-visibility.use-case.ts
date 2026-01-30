import { BuildPostTag } from "@/domain/services/build-post-tag.service";
import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { ResourceNotFoundException } from "@caffeine/errors/application";

export class TogglePostTagVisibilityUseCase {
	constructor(private readonly repository: IPostTagRepository) {}

	public async run(slug: string): Promise<IUnmountedPostTag> {
		const _targetPostTag = await this.repository.findBySlug(slug);

		if (!_targetPostTag) throw new ResourceNotFoundException("post@post-tag");

		const targetPostTag = BuildPostTag.run(_targetPostTag);

		targetPostTag.hidden = !targetPostTag.hidden;
		targetPostTag.updatedAt = new Date().toISOString();

		await this.repository.update(targetPostTag);

		return targetPostTag.unpack();
	}
}
