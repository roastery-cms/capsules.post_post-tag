import { BooleanDTO } from "@roastery/beans/collections/dtos";
import { t } from "@roastery/terroir";

export const UpdatePostTagQueryParamsDTO = t.Object({
	"update-slug": t.Optional(BooleanDTO),
});

export type UpdatePostTagQueryParamsDTO = t.Static<
	typeof UpdatePostTagQueryParamsDTO
>;
