import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import { UnpackPostTagService } from "@/domain/services";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";

export class FindPostTagUseCase {
	public constructor(
		private readonly findPostTagByType: FindEntityByTypeUseCase<
			IPostTag,
			IPostTagReader
		>,
	) {}

	public async run(id: string): Promise<IUnpackedPostTag> {
		const targetPostTag = await this.findPostTagByType.run(id, "post@post-tag");

		return UnpackPostTagService.run(targetPostTag);
	}
}
