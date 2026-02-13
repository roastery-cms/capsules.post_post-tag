import { PostTag } from "@/domain";
import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";
import { Mapper } from "@caffeine/entity";
import { EntitySource } from "@caffeine/entity/symbols";

export class FindPostTagUseCase {
	public constructor(
		private readonly findPostTagByType: FindEntityByTypeUseCase<
			IPostTag,
			IPostTagReader
		>,
	) {}

	public async run(id: string): Promise<IUnpackedPostTag> {
		const targetPostTag = await this.findPostTagByType.run(
			id,
			PostTag[EntitySource],
		);

		return Mapper.toDTO(targetPostTag);
	}
}
