import { describe, expect, it, beforeEach } from "vitest";
import { GetPostTagBySlugUseCase } from "./get-post-tag-by-slug.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain/post-tag";
import { ResourceNotFoundException } from "@caffeine/errors/application";

describe("GetPostTagBySlugUseCase", () => {
	let repository: PostTagRepository;
	let useCase: GetPostTagBySlugUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new GetPostTagBySlugUseCase(repository);
	});

	describe("run", () => {
		it("should find and return a post tag by slug", async () => {
			const tag = PostTag.make({
				name: "Test Tag",
				slug: "test-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("test-tag");

			expect(result).toBeDefined();
			expect(result.name).toBe("Test Tag");
			expect(result.slug).toBe("test-tag");
			expect(result.hidden).toBe(false);
		});

		it("should throw ResourceNotFoundException when tag does not exist", async () => {
			await expect(useCase.run("non-existent-tag")).rejects.toThrow(
				ResourceNotFoundException,
			);
		});

		it("should normalize slug before searching", async () => {
			const tag = PostTag.make({
				name: "Normalized Tag",
				slug: "normalized-tag",
				hidden: false,
			});
			await repository.create(tag);

			// Should normalize "Normalized Tag" to "normalized-tag"
			const result = await useCase.run("Normalized Tag");

			expect(result.slug).toBe("normalized-tag");
		});

		it("should find hidden tags", async () => {
			const tag = PostTag.make({
				name: "Hidden Tag",
				slug: "hidden-tag",
				hidden: true,
			});
			await repository.create(tag);

			const result = await useCase.run("hidden-tag");

			expect(result.hidden).toBe(true);
		});

		it("should return the correct tag among multiple tags", async () => {
			const tag1 = PostTag.make({
				name: "Tag 1",
				slug: "tag-1",
				hidden: false,
			});
			const tag2 = PostTag.make({
				name: "Tag 2",
				slug: "tag-2",
				hidden: false,
			});
			const tag3 = PostTag.make({
				name: "Tag 3",
				slug: "tag-3",
				hidden: false,
			});

			await repository.create(tag1);
			await repository.create(tag2);
			await repository.create(tag3);

			const result = await useCase.run("tag-2");

			expect(result.name).toBe("Tag 2");
			expect(result.slug).toBe("tag-2");
		});

		it("should return all properties of the unmounted tag", async () => {
			const tag = PostTag.make({
				name: "Complete Tag",
				slug: "complete-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("complete-tag");

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("name");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("hidden");
			expect(result).toHaveProperty("createdAt");
			expect(result).toHaveProperty("updatedAt");
		});

		it("should handle slugs with special characters", async () => {
			const tag = PostTag.make({
				name: "Special Tag",
				slug: "special-tag-123",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("special-tag-123");

			expect(result.slug).toBe("special-tag-123");
		});

		it("should throw ResourceNotFoundException with descriptive message", async () => {
			try {
				await useCase.run("missing-tag");
				expect.fail("Should have thrown ResourceNotFoundException");
			} catch (error) {
				expect(error).toBeInstanceOf(ResourceNotFoundException);
				if (error instanceof ResourceNotFoundException) {
					expect(error.message).toContain("missing-tag");
				}
			}
		});

		it("should be case-insensitive when normalizing slug", async () => {
			const tag = PostTag.make({
				name: "Case Test",
				slug: "case-test",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("CASE TEST");

			expect(result.slug).toBe("case-test");
		});

		it("should handle slugs with multiple hyphens", async () => {
			const tag = PostTag.make({
				name: "Multi Hyphen Tag",
				slug: "multi-hyphen-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("multi-hyphen-tag");

			expect(result.name).toBe("Multi Hyphen Tag");
		});
	});
});
