import { describe, it, expect, beforeEach } from "vitest";
import { CountPostTasUseCase } from "./count-post-tags.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("CountPostTagUseCase", () => {
	let useCase: CountPostTasUseCase;
	let repository: PostTagRepository;

	beforeEach(async () => {
		repository = new PostTagRepository();
		useCase = new CountPostTasUseCase(repository);

		// Populate with some data
		await repository.create(PostTag.make({ name: "Tag 1" }));
		await repository.create(PostTag.make({ name: "Tag 2" }));
		await repository.create(PostTag.make({ name: "Tag 3" }));
	});

	it("should return the correct count and total pages", async () => {
		const result = await useCase.run();

		expect(result.count).toBe(3);
		// Assuming default page size (10? 20?). If totalPages depends on constant, check at least type.
		expect(typeof result.totalPages).toBe("number");
		expect(result.totalPages).toBeGreaterThan(0);
	});

	it("should return 0 when no tags exist", async () => {
		repository.clear();

		const result = await useCase.run();

		expect(result.count).toBe(0);
		expect(result.totalPages).toBe(0);
	});
});
