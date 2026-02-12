import type { CreatePostTagDTO } from "../dtos/create-post-tag.dto";
import { ResourceAlreadyExistsException } from "@caffeine/errors/application";
import { PostTag } from "@/domain/post-tag";
import type { IUnpackedPostTag } from "@/domain/types";
import type { IPostTagWriter } from "@/domain/types/post-tag-writer.interface";
import { Mapper } from "@caffeine/entity";
import { EntitySource } from "@caffeine/entity/symbols";
import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";

export class CreatePostTagUseCase {
	public constructor(
		private readonly writer: IPostTagWriter,
		private readonly uniquenessChecker: IPostTagUniquenessCheckerService,
	) {}

	public async run(data: CreatePostTagDTO): Promise<IUnpackedPostTag> {
		const targetPostTag = PostTag.make({
			name: data.name,
		});

		if (!(await this.uniquenessChecker.run(targetPostTag.slug)))
			throw new ResourceAlreadyExistsException(targetPostTag[EntitySource]);

		await this.writer.create(targetPostTag);

		return Mapper.toDTO(targetPostTag);
	}
}
