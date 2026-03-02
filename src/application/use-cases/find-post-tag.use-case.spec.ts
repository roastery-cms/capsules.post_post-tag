import { describe, it, expect, mock, beforeEach } from "bun:test";
import { FindPostTagUseCase } from "./find-post-tag.use-case";
import { PostTag } from "@/domain/post-tag";
import { makeEntity } from "@caffeine/entity/factories";
import { generateUUID } from "@caffeine/entity/helpers";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";
import type { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";

describe("FindPostTagUseCase", () => {
    let useCase: FindPostTagUseCase;
    let mockRun: ReturnType<typeof mock>;

    beforeEach(() => {
        mockRun = mock();
        const findEntityByType = {
            run: mockRun,
        } as unknown as FindEntityByTypeUseCase<
            typeof UnpackedPostTagDTO,
            IPostTag,
            IPostTagReader
        >;
        useCase = new FindPostTagUseCase(findEntityByType);
    });

    it("should delegate to findEntityByType with the correct source", async () => {
        const id = generateUUID();
        const props = makeEntity();
        props.id = id;
        const postTag = PostTag.make({ name: "Tag 1" }, props);

        mockRun.mockResolvedValue(postTag);

        const result = await useCase.run(id);

        expect(mockRun).toHaveBeenCalledWith(id, "post@post-tag");
        expect(result.id).toBe(id);
        expect(result.name).toBe("Tag 1");
    });

    it("should propagate errors from findEntityByType", async () => {
        mockRun.mockRejectedValue(new Error("Not found"));

        await expect(useCase.run(generateUUID())).rejects.toThrow("Not found");
    });
});
