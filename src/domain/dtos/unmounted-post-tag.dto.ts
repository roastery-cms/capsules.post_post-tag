import { EntityDTO } from "@caffeine/models/dtos";
import { BuildPostTagDTO } from "./build-post-tag.dto";
import { t } from "@caffeine/models";

export const UnmountedPostTagDTO = t.Composite([BuildPostTagDTO, EntityDTO]);

export type UnmountedPostTagDTO = t.Static<typeof UnmountedPostTagDTO>;
