import { PostTag } from "@/domain";
import type { IPostTag, IUnpackedPostTag } from "@/domain/types";
import { parsePrismaDateTimeToISOString } from "@caffeine-adapters/post/helpers";

type PostTagPrismaDefaultOutput = Omit<
    IUnpackedPostTag,
    "createdAt" | "updatedAt"
> & {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
};

export const PrismaPostTagMapper = {
    run: (content: PostTagPrismaDefaultOutput): IPostTag => {
        const { id, createdAt, updatedAt, ...properties } =
            parsePrismaDateTimeToISOString(content);

        return PostTag.make(properties, { id, createdAt, updatedAt });
    },
} as const;
