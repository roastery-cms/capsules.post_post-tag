import { t } from "@caffeine/models";
import { BooleanDTO } from "@caffeine/models/dtos/primitives";

export const UpdatePostTagQueryParamsDTO = t.Object({
	"update-slug": t.Optional(BooleanDTO),
});

export type UpdatePostTagQueryParamsDTO = t.Static<
	typeof UpdatePostTagQueryParamsDTO
>;
