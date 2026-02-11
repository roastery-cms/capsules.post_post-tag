import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnpackedPostTag } from "@/domain/types/unpacked-post-tag.interface";
import { ResourceNotFoundException } from "@caffeine/errors/application";

export class GetPostTagByIdUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(id: string): Promise<IUnpackedPostTag> {
		const targetPostTag = await this.repository.findById(id);

		if (!targetPostTag)
			throw new ResourceNotFoundException(
				"post@post-tag",
				`PostTag with id as ${id} Was Not Found.`,
			);

		return targetPostTag;
	}
}
