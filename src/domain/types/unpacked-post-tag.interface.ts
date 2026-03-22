import type { IRawEntity } from "@roastery/beans/entity/types";
import type { IRawPostTag } from "./raw-post-tag.interface";

export interface IUnpackedPostTag extends IRawEntity, IRawPostTag {}
