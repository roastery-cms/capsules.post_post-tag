import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";
import { ResourceNotFoundException } from "@caffeine/errors/application";

export class GetPostTagByIdUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(id: string): Promise<IUnmountedPostTag> {
		const targetPostTag = await this.repository.findById(id);

		if (!targetPostTag)
			throw new ResourceNotFoundException(
				"post@post-tag",
				`PostTag with id as ${id} Was Not Found.`,
			);

		return targetPostTag;
	}
}
