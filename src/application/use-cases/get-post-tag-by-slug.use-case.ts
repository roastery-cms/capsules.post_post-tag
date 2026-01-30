import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { ResourceNotFoundException } from "@caffeine/errors/application";
import { slugify } from "@caffeine/models/helpers";

export class GetPostTagBySlugUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(slug: string): Promise<IUnmountedPostTag> {
		slug = slugify(slug);

		const targetPostTag = await this.repository.findBySlug(slug);

		if (!targetPostTag)
			throw new ResourceNotFoundException(
				"post@post-tag",
				`PostTag with slug as ${slug} Was Not Found.`,
			);

		return targetPostTag;
	}
}
