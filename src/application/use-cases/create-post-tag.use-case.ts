import type { CreatePostTagDTO } from "../dtos/create-post-tag.dto";
import { PostTag } from "@/domain/post-tag";
import type { IPostTagWriter } from "@/domain/types/post-tag-writer.interface";
import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";
import { EntitySource } from "@roastery/beans/entity/symbols";
import { ResourceAlreadyExistsException } from "@roastery/terroir/exceptions/application";

export class CreatePostTagUseCase {
	public constructor(
		private readonly writer: IPostTagWriter,
		private readonly uniquenessChecker: IPostTagUniquenessCheckerService,
	) {}

	public async run(data: CreatePostTagDTO) {
		const targetPostTag = PostTag.make({
			name: data.name,
		});

		if (!(await this.uniquenessChecker.run(targetPostTag.slug)))
			throw new ResourceAlreadyExistsException(targetPostTag[EntitySource]);

		await this.writer.create(targetPostTag);

		return targetPostTag;
	}
}
