import type { CreatePostTagDTO } from "../dtos/create-post-tag.dto";
import type { PostTagUniquenessCheckerService } from "@/domain/services/post-tag-uniqueness-checker.service";
import { ResourceAlreadyExistsException } from "@caffeine/errors/application";
import { PostTag } from "@/domain/post-tag";
import type { IUnpackedPostTag } from "@/domain/types";
import type { IPostTagWriter } from "@/domain/types/post-tag-writer.interface";
import { UnpackPostTagService } from "@/domain/services";

export class CreatePostTagUseCase {
	public constructor(
		private readonly writer: IPostTagWriter,
		private readonly uniquenessChecker: PostTagUniquenessCheckerService,
	) {}

	public async run(data: CreatePostTagDTO): Promise<IUnpackedPostTag> {
		const targetPostTag = PostTag.make({
			name: data.name,
		});

		if (!(await this.uniquenessChecker.run(targetPostTag.slug)))
			throw new ResourceAlreadyExistsException(targetPostTag.__source);

		await this.writer.create(targetPostTag);

		return UnpackPostTagService.run(targetPostTag);
	}
}
