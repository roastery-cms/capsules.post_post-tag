import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import { GetNumberOfPagesService } from "@roastery/seedbed/application/services";
import type { ICountItems } from "@roastery/seedbed/application/types";

export class CountPostTagsUseCase {
	public constructor(private readonly reader: IPostTagReader) {}

	public async run(): Promise<ICountItems> {
		const count = await this.reader.count();

		return {
			totalPages: GetNumberOfPagesService.run(count),
			count,
		};
	}
}
