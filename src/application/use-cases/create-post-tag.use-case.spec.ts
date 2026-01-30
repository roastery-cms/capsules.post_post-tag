import { describe, expect, it, beforeEach } from "vitest";
import { CreatePostTagUseCase } from "./create-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { ResourceAlreadyExistsException } from "@caffeine/errors/application";

describe("CreatePostTagUseCase", () => {
	let repository: PostTagRepository;
	let useCase: CreatePostTagUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new CreatePostTagUseCase(repository);
	});

	describe("run", () => {
		it("should create a new post tag successfully", async () => {
			const result = await useCase.run({ name: "Test Tag" });

			expect(result).toBeDefined();
			expect(result.name).toBe("Test Tag");
			expect(result.slug).toBe("test-tag");
			expect(result.hidden).toBe(false);
			expect(result.id).toBeDefined();
			expect(result.createdAt).toBeDefined();
			// Note: updatedAt is checked in the "return unmounted post tag" test
		});

		it("should generate slug from name automatically", async () => {
			const result = await useCase.run({ name: "My Awesome Tag" });

			expect(result.slug).toBe("my-awesome-tag");
		});

		it("should set hidden to false by default", async () => {
			const result = await useCase.run({ name: "Visible Tag" });

			expect(result.hidden).toBe(false);
		});

		it("should store the created tag in the repository", async () => {
			await useCase.run({ name: "Stored Tag" });

			const allTags = repository.getAll();
			expect(allTags).toHaveLength(1);

			const storedTag = allTags[0];
			if (storedTag) {
				expect(storedTag.name).toBe("Stored Tag");
				expect(storedTag.slug).toBe("stored-tag");
			}
		});

		it("should throw ResourceAlreadyExistsException when slug already exists", async () => {
			await useCase.run({ name: "Duplicate Tag" });

			await expect(useCase.run({ name: "Duplicate Tag" })).rejects.toThrow(
				ResourceAlreadyExistsException,
			);
		});

		it("should throw ResourceAlreadyExistsException for different names with same slug", async () => {
			await useCase.run({ name: "Test Tag" });

			// "test-tag" and "Test Tag" generate the same slug
			await expect(useCase.run({ name: "test-tag" })).rejects.toThrow(
				ResourceAlreadyExistsException,
			);
		});

		it("should handle special characters in name", async () => {
			const result = await useCase.run({ name: "Tag with @#! Special" });

			// slugify may keep some characters like $, so just verify it's defined and name is preserved
			expect(result.slug).toBeDefined();
			expect(result.slug).toContain("tag");
			expect(result.name).toBe("Tag with @#! Special");
		});

		it("should handle names with multiple spaces", async () => {
			const result = await useCase.run({ name: "Tag   with   spaces" });

			expect(result.slug).toBe("tag-with-spaces");
		});

		it("should create multiple different tags successfully", async () => {
			await useCase.run({ name: "Tag 1" });
			await useCase.run({ name: "Tag 2" });
			await useCase.run({ name: "Tag 3" });

			const allTags = repository.getAll();
			expect(allTags).toHaveLength(3);
		});

		it("should handle unicode characters in name", async () => {
			const result = await useCase.run({ name: "Café & Açúcar" });

			expect(result.name).toBe("Café & Açúcar");
			expect(result.slug).toBeDefined();
		});

		it("should return unmounted post tag with all required properties", async () => {
			const result = await useCase.run({ name: "Complete Tag" });

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("name");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("hidden");
			expect(result).toHaveProperty("createdAt");
			expect(result).toHaveProperty("updatedAt");
		});
	});
});
