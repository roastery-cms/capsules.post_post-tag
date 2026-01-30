import { EntityDTO } from "@caffeine/models/dtos";
import { BuildPostTagDTO } from "./build-post-tag.dto";
import { t } from "@caffeine/models";

export const UnmountedPostTagDTO = t.Composite([BuildPostTagDTO, EntityDTO], {
	description:
		"Data transfer object representing a complete post tag entity in its serialized form. Combines the build properties (name, slug, hidden) with entity metadata (id, createdAt, updatedAt).",
});

export type UnmountedPostTagDTO = t.Static<typeof UnmountedPostTagDTO>;
