import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnpackedPostTag } from "@/domain/types/unpacked-post-tag.interface";

export class GetPostTagsByPageUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	run(page: number): Promise<IUnpackedPostTag[]> {
		return this.repository.findMany(page);
	}
}
