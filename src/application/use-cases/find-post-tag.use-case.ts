import { PostTag } from "@/domain";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";
import { EntitySource } from "@caffeine/entity/symbols";

export class FindPostTagUseCase {
	public constructor(
		private readonly findPostTagByType: FindEntityByTypeUseCase<
			IPostTag,
			IPostTagReader
		>,
	) {}

	public run(id: string) {
		return this.findPostTagByType.run(id, PostTag[EntitySource]);
	}
}
