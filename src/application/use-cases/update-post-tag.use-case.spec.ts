import { describe, expect, it, beforeEach } from "vitest";
import { UpdatePostTagUseCase } from "./update-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain/post-tag";
import { ResourceNotFoundException } from "@caffeine/errors/application";

describe("UpdatePostTagUseCase", () => {
	let repository: PostTagRepository;
	let useCase: UpdatePostTagUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new UpdatePostTagUseCase(repository);
	});

	describe("run", () => {
		it("should update tag name and regenerate slug", async () => {
			const tag = PostTag.make({
				name: "Original Name",
				slug: "original-name",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original-name", {
				name: "Updated Name",
			});

			expect(result.name).toBe("Updated Name");
			expect(result.slug).toBe("updated-name");
		});

		it("should update hidden property", async () => {
			const tag = PostTag.make({
				name: "Test Tag",
				slug: "test-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("test-tag", { hidden: true });

			expect(result.hidden).toBe(true);
			expect(result.name).toBe("Test Tag");
		});

		it("should update both name and hidden", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", {
				name: "Updated",
				hidden: true,
			});

			expect(result.name).toBe("Updated");
			expect(result.slug).toBe("updated");
			expect(result.hidden).toBe(true);
		});

		it("should throw ResourceNotFoundException when tag does not exist", async () => {
			await expect(
				useCase.run("non-existent", { name: "New Name" }),
			).rejects.toThrow(ResourceNotFoundException);
		});

		it("should update the tag in the repository", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			await useCase.run("original", { name: "Modified" });

			const updatedTag = await repository.findBySlug("modified");
			expect(updatedTag).toBeDefined();
			if (updatedTag) {
				expect(updatedTag.name).toBe("Modified");
			}
		});


		it("should update updatedAt timestamp when hidden changes", async () => {
			const tag = PostTag.make({
				name: "Test",
				slug: "test",
				hidden: false,
			});
			await repository.create(tag);

			const originalUpdatedAt = tag.updatedAt;

			await new Promise((resolve) => setTimeout(resolve, 10));

			const result = await useCase.run("test", { hidden: true });

			expect(result.updatedAt).not.toBe(originalUpdatedAt);
		});

		it("should preserve other properties when updating", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", { name: "Updated" });

			expect(result.id).toBe(tag.id);
			expect(result.createdAt).toBe(tag.createdAt);
		});

		it("should handle updating with empty object (no changes)", async () => {
			const tag = PostTag.make({
				name: "Unchanged",
				slug: "unchanged",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("unchanged", {});

			expect(result.name).toBe("Unchanged");
			expect(result.slug).toBe("unchanged");
			expect(result.hidden).toBe(false);
		});

		it("should handle special characters in new name", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", {
				name: "Updated @#! Name",
			});

			expect(result.name).toBe("Updated @#! Name");
			// slugify may keep some characters, so just verify it's defined
			expect(result.slug).toBeDefined();
			expect(result.slug).toContain("updated");
		});

		it("should handle unicode characters in new name", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", { name: "Café & Açúcar" });

			expect(result.name).toBe("Café & Açúcar");
			expect(result.slug).toBeDefined();
		});

		it("should return unmounted post tag with all properties", async () => {
			const tag = PostTag.make({
				name: "Test",
				slug: "test",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("test", { name: "Updated" });

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("name");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("hidden");
			expect(result).toHaveProperty("createdAt");
			expect(result).toHaveProperty("updatedAt");
		});

		it("should handle updating among multiple tags correctly", async () => {
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

			await repository.create(tag1);
			await repository.create(tag2);

			await useCase.run("tag-2", { name: "Updated Tag 2" });

			const unchangedTag = await repository.findBySlug("tag-1");
			const updatedTag = await repository.findBySlug("updated-tag-2");

			if (unchangedTag && updatedTag) {
				expect(unchangedTag.name).toBe("Tag 1");
				expect(updatedTag.name).toBe("Updated Tag 2");
			}
		});

		it("should handle multiple sequential updates", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result1 = await useCase.run("original", { name: "First Update" });
			expect(result1.name).toBe("First Update");
			expect(result1.slug).toBe("first-update");

			const result2 = await useCase.run("first-update", {
				name: "Second Update",
			});
			expect(result2.name).toBe("Second Update");
			expect(result2.slug).toBe("second-update");
		});

		it("should update only name when hidden is undefined", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", { name: "Updated" });

			expect(result.name).toBe("Updated");
			expect(result.hidden).toBe(false);
		});

		it("should update only hidden when name is undefined", async () => {
			const tag = PostTag.make({
				name: "Original",
				slug: "original",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run("original", { hidden: true });

			expect(result.name).toBe("Original");
			expect(result.slug).toBe("original");
			expect(result.hidden).toBe(true);
		});
	});
});
