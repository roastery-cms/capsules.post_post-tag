import { t } from "@caffeine/models";
import { RepositoryProviderDTO } from "../factories/repositories/dtos";

export const PostTypeDependenciesDTO = t.Object({
    DATABASE_URL: t.Optional(t.String()),
    DATABASE_PROVIDER: t.Optional(RepositoryProviderDTO),
});

export type PostTypeDependenciesDTO = t.Static<typeof PostTypeDependenciesDTO>;
