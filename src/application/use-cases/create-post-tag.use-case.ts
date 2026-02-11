import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnpackedPostTag } from "@/domain/types/unpacked-post-tag.interface";
import type { CreatePostTagDTO } from "../dtos/create-post-tag.dto";
import { slugify } from "@caffeine/models/helpers";
import { PostTagUniquenessChecker } from "@/domain/services/post-tag-uniqueness-checker.service";
import { ResourceAlreadyExistsException } from "@caffeine/errors/application";
import { PostTag } from "@/domain/post-tag";
import type { IPostTag } from "@/domain/types";

export class CreatePostTagUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(data: CreatePostTagDTO): Promise<IPostTag> {
		const postTagUniquenessChecker = new PostTagUniquenessChecker(
			this.repository,
		);

		const slug = slugify(data.name);

		if (await postTagUniquenessChecker.run(slug))
			throw new ResourceAlreadyExistsException("post@post-tag");

		const targetPostTag = PostTag.make({
			hidden: false,
			name: data.name,
			slug,
		});

		await this.repository.create(targetPostTag);

		return targetPostTag;
	}
}
