import { t } from "@roastery/terroir";
import { RepositoryProviderDTO } from "../factories/repositories/dtos";

export const PostTagDependenciesDTO = t.Object({
	DATABASE_URL: t.Optional(t.String()),
	DATABASE_PROVIDER: t.Optional(RepositoryProviderDTO),
});

export type PostTagDependenciesDTO = t.Static<typeof PostTagDependenciesDTO>;
