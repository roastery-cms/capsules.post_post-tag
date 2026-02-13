import { describe, it, expect, beforeEach } from "vitest";
import { FindManyPostTagsUseCase } from "./find-many-post-tags.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("FindManyPostTagsUseCase", () => {
	let useCase: FindManyPostTagsUseCase;
	let repository: PostTagRepository;

	beforeEach(async () => {
		repository = new PostTagRepository();
		useCase = new FindManyPostTagsUseCase(repository);

		// Populate with some data
		await repository.create(PostTag.make({ name: "Tag 1" }));
		await repository.create(PostTag.make({ name: "Tag 2" }));
		await repository.create(PostTag.make({ name: "Tag 3" }));
	});

	it("should return a list of post tags", async () => {
		const result = await useCase.run(0);

		expect(result).toHaveLength(3);
		expect(result[0]).toHaveProperty("name");
		expect(result[0].name).toBe("Tag 1");
	});

	it("should return empty list if page is out of range or empty", async () => {
		// Assuming page 10 is out of range for 3 items
		const result = await useCase.run(10);
		expect(result).toHaveLength(0);
	});
});
