import type { IPostTagReader } from "../types/post-tag-reader.interface";

export class PostTagUniquenessCheckerService {
	public constructor(private readonly reader: IPostTagReader) {}

	public async run(slug: string): Promise<boolean> {
		return !(await this.reader.findBySlug(slug));
	}
}
