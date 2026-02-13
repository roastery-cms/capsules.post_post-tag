import { UnpackedPostTagDTO } from "@/domain/dtos";
import { t } from "@caffeine/models";

export const FindManyPostsResponseDTO = t.Array(UnpackedPostTagDTO, {
	description: "A paginated list of post tags.",
});

export type FindManyPostsResponseDTO = t.Static<
	typeof FindManyPostsResponseDTO
>;
