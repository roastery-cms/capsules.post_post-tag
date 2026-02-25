import { describe, it, expect, beforeEach } from "vitest";
import { FindManyPostTagsUseCase } from "./find-many-post-tags.use-case";
import { CountPostTagsUseCase } from "./count-post-tags.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("FindManyPostTagsUseCase", () => {
	let useCase: FindManyPostTagsUseCase;
	let repository: PostTagRepository;

	beforeEach(async () => {
		repository = new PostTagRepository();
		useCase = new FindManyPostTagsUseCase(
			repository,
			new CountPostTagsUseCase(repository),
		);

		// Populate with some data
		await repository.create(PostTag.make({ name: "Tag 1" }));
		await repository.create(PostTag.make({ name: "Tag 2" }));
		await repository.create(PostTag.make({ name: "Tag 3" }));
	});

	it("should return a paginated list of post tags along with count", async () => {
		const result = await useCase.run(0);

		expect(result).toHaveProperty("count", 3);
		expect(result).toHaveProperty("totalPages", 1);
		expect(result.value).toHaveLength(3);
		expect(result.value[0]?.name).toBe("Tag 1");
	});

	it("should return empty list if page is out of range or empty", async () => {
		const result = await useCase.run(10);

		expect(result.value).toHaveLength(0);
		expect(result.count).toBe(3);
		expect(result.totalPages).toBe(1);
	});
});
