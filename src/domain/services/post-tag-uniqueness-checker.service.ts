import type { IPostTagRepository } from "../types/post-tag.repository.interface";

export class PostTagUniquenessChecker {
	public constructor(private readonly repository: IPostTagRepository) {}

	public async run(slug: string): Promise<boolean> {
		return !!(await this.repository.findBySlug(slug));
	}
}
