import { PostTag } from "@/domain";
import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import { InvalidPropertyException } from "@roastery/terroir/exceptions/domain";
import { UnexpectedCacheValueException } from "@roastery/terroir/exceptions/infra";

export const CachedPostTagMapper = {
	run(key: string, data: string | IUnpackedPostTag): IPostTag {
		const { id, createdAt, updatedAt, ...properties }: IUnpackedPostTag =
			typeof data === "string" ? JSON.parse(data) : data;

		try {
			return PostTag.make(properties, { id, createdAt, updatedAt });
		} catch (err: unknown) {
			if (err instanceof InvalidPropertyException)
				throw new UnexpectedCacheValueException(
					key,
					`${err.source}::${err.property}`,
					err.message,
				);

			throw err;
		}
	},
} as const;
