import { Schema } from "@caffeine/schema";
import { UnpackedPostTagDTO } from "../dtos";

export const UnpackedPostTagSchema: Schema<typeof UnpackedPostTagDTO> =
	Schema.make(UnpackedPostTagDTO);

export type UnpackedPostTagSchema = typeof UnpackedPostTagDTO;
