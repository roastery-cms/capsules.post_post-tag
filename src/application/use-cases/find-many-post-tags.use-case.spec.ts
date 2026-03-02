import { describe, it, expect, beforeEach } from "bun:test";
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

		await repository.create(PostTag.make({ name: "Tag 1" }));
		await repository.create(PostTag.make({ name: "Tag 2" }));
		await repository.create(PostTag.make({ name: "Tag 3" }));
	});

	it("should return paginated results with count and totalPages", async () => {
		const result = await useCase.run(0);

		expect(result.count).toBe(3);
		expect(result.totalPages).toBe(1);
		expect(result.value).toHaveLength(3);
		expect(result.value[0]!.name).toBe("Tag 1");
	});

	it("should return empty value for out-of-range page", async () => {
		const result = await useCase.run(10);

		expect(result.value).toHaveLength(0);
		expect(result.count).toBe(3);
		expect(result.totalPages).toBe(1);
	});

	it("should return all fields for each tag in the list", async () => {
		const result = await useCase.run(0);

		for (const tag of result.value) {
			expect(tag.id).toBeDefined();
			expect(tag.name).toBeDefined();
			expect(tag.slug).toBeDefined();
			expect(typeof tag.hidden).toBe("boolean");
		}
	});
});
