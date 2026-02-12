import { PostTag } from "@/domain";
import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import { InvalidPropertyException } from "@caffeine/errors/domain";
import { UnexpectedCacheValueException } from "@caffeine/errors/infra";

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
