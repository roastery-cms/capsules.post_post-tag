import type { IPostTagReader } from "./post-tag-reader.interface";
import type { IPostTagWriter } from "./post-tag-writer.interface";

export interface IPostTagRepository extends IPostTagReader, IPostTagWriter {}
