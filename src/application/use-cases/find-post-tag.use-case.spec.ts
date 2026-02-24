import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindPostTagUseCase } from "./find-post-tag.use-case";
import { PostTag } from "@/domain/post-tag";
import { makeEntity } from "@caffeine/entity/factories";
import { generateUUID } from "@caffeine/entity/helpers";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";

describe("FindPostTagUseCase", () => {
	let useCase: FindPostTagUseCase;
	let findEntityByType: FindEntityByTypeUseCase<any, any, any>;

	beforeEach(() => {
		findEntityByType = {
			run: vi.fn(),
		} as unknown as FindEntityByTypeUseCase<any, any, any>;
		useCase = new FindPostTagUseCase(findEntityByType);
	});

	it("should find a post tag by id", async () => {
		const id = generateUUID();
		const props = makeEntity();
		props.id = id;
		const postTag = PostTag.make({ name: "Tag 1" }, props);

		vi.mocked(findEntityByType.run).mockResolvedValue(postTag);

		const result = await useCase.run(id);

		expect(findEntityByType.run).toHaveBeenCalledWith(id, "post@post-tag");
		expect(result.id).toBe(id);
		expect(result.name).toBe("Tag 1");
	});
});
