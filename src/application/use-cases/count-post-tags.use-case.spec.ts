import { describe, it, expect, beforeEach } from "bun:test";
import { CountPostTagsUseCase } from "./count-post-tags.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("CountPostTagsUseCase", () => {
	let useCase: CountPostTagsUseCase;
	let repository: PostTagRepository;

	beforeEach(async () => {
		repository = new PostTagRepository();
		useCase = new CountPostTagsUseCase(repository);

		await repository.create(PostTag.make({ name: "Tag 1" }));
		await repository.create(PostTag.make({ name: "Tag 2" }));
		await repository.create(PostTag.make({ name: "Tag 3" }));
	});

	it("should return the correct count", async () => {
		const result = await useCase.run();

		expect(result.count).toBe(3);
	});

	it("should return totalPages as a positive number", async () => {
		const result = await useCase.run();

		expect(result.totalPages).toBeGreaterThan(0);
	});

	it("should return 0 count and 0 totalPages when empty", async () => {
		repository.clear();

		const result = await useCase.run();

		expect(result.count).toBe(0);
		expect(result.totalPages).toBe(0);
	});

	it("should reflect newly added tags", async () => {
		await repository.create(PostTag.make({ name: "Tag 4" }));

		const result = await useCase.run();

		expect(result.count).toBe(4);
	});
});
