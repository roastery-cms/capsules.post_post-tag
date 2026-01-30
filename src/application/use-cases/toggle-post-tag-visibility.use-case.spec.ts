import { describe, expect, it, beforeEach } from "vitest";
import { TogglePostTagVisibilityUseCase } from "./toggle-post-tag-visibility.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain/post-tag";
import { ResourceNotFoundException } from "@caffeine/errors/application";

describe("TogglePostTagVisibilityUseCase", () => {
	let repository: PostTagRepository;
	let useCase: TogglePostTagVisibilityUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new TogglePostTagVisibilityUseCase(repository);
	});

	describe("run", () => {
		it("should toggle visibility from false to true", async () => {
			const tag = PostTag.make({
				name: "Visible Tag",
				slug: "visible-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("visible-tag");

			expect(result.hidden).toBe(true);
			expect(result.name).toBe("Visible Tag");
		});

		it("should toggle visibility from true to false", async () => {
			const tag = PostTag.make({
				name: "Hidden Tag",
				slug: "hidden-tag",
				hidden: true,
			});
			await repository.create(tag);

			const result = await useCase.run("hidden-tag");

			expect(result.hidden).toBe(false);
			expect(result.name).toBe("Hidden Tag");
		});

		it("should update the tag in the repository", async () => {
			const tag = PostTag.make({
				name: "Test Tag",
				slug: "test-tag",
				hidden: false,
			});
			await repository.create(tag);

			await useCase.run("test-tag");

			const updatedTag = await repository.findBySlug("test-tag");
			expect(updatedTag).toBeDefined();
			if (updatedTag) {
				expect(updatedTag.hidden).toBe(true);
			}
		});


		it("should throw ResourceNotFoundException when tag does not exist", async () => {
			await expect(useCase.run("non-existent-tag")).rejects.toThrow(
				ResourceNotFoundException,
			);
		});

		it("should preserve other properties when toggling", async () => {
			const tag = PostTag.make({
				name: "Preserve Tag",
				slug: "preserve-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("preserve-tag");

			expect(result.name).toBe("Preserve Tag");
			expect(result.slug).toBe("preserve-tag");
			expect(result.id).toBe(tag.id);
			expect(result.createdAt).toBe(tag.createdAt);
		});

		it("should toggle multiple times correctly", async () => {
			const tag = PostTag.make({
				name: "Toggle Tag",
				slug: "toggle-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result1 = await useCase.run("toggle-tag");
			expect(result1.hidden).toBe(true);

			const result2 = await useCase.run("toggle-tag");
			expect(result2.hidden).toBe(false);

			const result3 = await useCase.run("toggle-tag");
			expect(result3.hidden).toBe(true);
		});

		it("should return unmounted post tag with all properties", async () => {
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

		it("should work with tags that have special characters in slug", async () => {
			const tag = PostTag.make({
				name: "Special Tag",
				slug: "special-tag-123",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("special-tag-123");

			expect(result.hidden).toBe(true);
			expect(result.slug).toBe("special-tag-123");
		});

		it("should handle toggling among multiple tags correctly", async () => {
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
				hidden: true,
			});

			await repository.create(tag1);
			await repository.create(tag2);
			await repository.create(tag3);

			await useCase.run("tag-2");

			const updatedTag1 = await repository.findBySlug("tag-1");
			const updatedTag2 = await repository.findBySlug("tag-2");
			const updatedTag3 = await repository.findBySlug("tag-3");

			if (updatedTag1 && updatedTag2 && updatedTag3) {
				expect(updatedTag1.hidden).toBe(false); // Unchanged
				expect(updatedTag2.hidden).toBe(true); // Toggled
				expect(updatedTag3.hidden).toBe(true); // Unchanged
			}
		});
	});
});
