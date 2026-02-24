import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";

export class FindManyPostTagsUseCase {
	public constructor(private readonly reader: IPostTagReader) {}

	public run(page: number) {
		return this.reader.findMany(page);
	}
}
