import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import type { CountPostTagsUseCase } from "./count-post-tags.use-case";

export class FindManyPostTagsUseCase {
	public constructor(
		private readonly reader: IPostTagReader,
		private readonly countPostTags: CountPostTagsUseCase,
	) {}

	public async run(page: number) {
		const { count, totalPages } = await this.countPostTags.run();
		return { count, totalPages, value: await this.reader.findMany(page) };
	}
}
