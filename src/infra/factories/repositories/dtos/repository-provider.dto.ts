import { t } from "@roastery/terroir";

export const RepositoryProviderDTO = t.Union([
	t.Literal("PRISMA"),
	t.Literal("MEMORY"),
]);

export type RepositoryProviderDTO = t.Static<typeof RepositoryProviderDTO>;
