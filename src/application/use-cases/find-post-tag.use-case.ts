import { PostTag } from "@/domain";
import type { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import { EntitySource } from "@roastery/beans/entity/symbols";
import type { FindEntityByTypeUseCase } from "@roastery/seedbed/application/use-cases";

export class FindPostTagUseCase {
	public constructor(
		private readonly findPostTagByType: FindEntityByTypeUseCase<
			typeof UnpackedPostTagDTO,
			IPostTag,
			IPostTagReader
		>,
	) {}

	public run(id: string) {
		return this.findPostTagByType.run(id, PostTag[EntitySource]);
	}
}
