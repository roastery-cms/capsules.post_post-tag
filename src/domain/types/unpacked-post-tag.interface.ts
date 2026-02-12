import type { IRawEntity } from "@caffeine/entity/types";
import type { IRawPostTag } from "./raw-post-tag.interface";

export interface IUnpackedPostTag extends IRawEntity, IRawPostTag {}
