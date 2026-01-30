import type { IPostTagRepository } from "@/domain/types/post-tag.repository.interface";
import type { IUnmountedPostTag } from "@/domain/types/unmounted-post-tag.interface";

export class GetPostTagsByPageUseCase {
	public constructor(private readonly repository: IPostTagRepository) {}

	run(page: number): Promise<IUnmountedPostTag[]> {
		return this.repository.findMany(page);
	}
}
