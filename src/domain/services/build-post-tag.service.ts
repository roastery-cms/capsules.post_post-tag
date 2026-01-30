import { InvalidDomainDataException } from "@caffeine/errors/domain";
import { PostTag } from "../post-tag";
import type { IUnmountedPostTag } from "../types/unmounted-post-tag.interface";
import { Schema } from "@caffeine/models";
import { UnmountedPostTagDTO } from "../dtos/unmounted-post-tag.dto";

export class BuildPostTag {
	public static run(unmountedPostTag: IUnmountedPostTag): PostTag {
		if (!Schema.make(UnmountedPostTagDTO).match(unmountedPostTag))
			throw new InvalidDomainDataException("post@post-tag::unmount");

		const { id, createdAt, updatedAt, ...properties } = unmountedPostTag;

		return PostTag.make(properties, { id, createdAt, updatedAt });
	}
}
