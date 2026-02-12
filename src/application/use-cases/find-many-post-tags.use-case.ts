import { UnpackPostTagService } from "@/domain/services";
import type { IUnpackedPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";

export class FindManyPostTagsUseCase {
	public constructor(private readonly reader: IPostTagReader) {}

	public async run(page: number): Promise<Array<IUnpackedPostTag>> {
		return (await this.reader.findMany(page)).map((postTag) =>
			UnpackPostTagService.run(postTag),
		);
	}
}
