import { describe, expect, it, beforeEach } from "vitest";
import { PostTagUniquenessChecker } from "./post-tag-uniqueness-checker.service";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "../post-tag";

describe("PostTagUniquenessChecker Service", () => {
	let repository: PostTagRepository;
	let service: PostTagUniquenessChecker;

	beforeEach(() => {
		repository = new PostTagRepository();
		service = new PostTagUniquenessChecker(repository);
	});

	describe("run", () => {
		it("should return true when a tag with the given slug exists", async () => {
			const postTag = PostTag.make({
				name: "Existing Tag",
				slug: "existing-tag",
				hidden: false,
			});

			await repository.create(postTag);

			const exists = await service.run("existing-tag");

			expect(exists).toBe(true);
		});

		it("should return false when no tag with the given slug exists", async () => {
			const exists = await service.run("non-existent-tag");

			expect(exists).toBe(false);
		});

		it("should return true for the correct slug among multiple tags", async () => {
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

			const exists = await service.run("tag-2");

			expect(exists).toBe(true);
		});

		it("should return false for non-existent slug among multiple tags", async () => {
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

			const exists = await service.run("tag-3");

			expect(exists).toBe(false);
		});

		it("should be case-sensitive when checking slug uniqueness", async () => {
			const postTag = PostTag.make({
				name: "Case Test",
				slug: "case-test",
				hidden: false,
			});

			await repository.create(postTag);

			const existsLowercase = await service.run("case-test");
			const existsUppercase = await service.run("CASE-TEST");

			expect(existsLowercase).toBe(true);
			expect(existsUppercase).toBe(false);
		});

		it("should return true for hidden tags", async () => {
			const hiddenTag = PostTag.make({
				name: "Hidden Tag",
				slug: "hidden-tag",
				hidden: true,
			});

			await repository.create(hiddenTag);

			const exists = await service.run("hidden-tag");

			expect(exists).toBe(true);
		});

		it("should handle empty repository correctly", async () => {
			const exists = await service.run("any-slug");

			expect(exists).toBe(false);
		});

		it("should work correctly after repository is cleared", async () => {
			const postTag = PostTag.make({
				name: "Temporary Tag",
				slug: "temporary-tag",
				hidden: false,
			});

			await repository.create(postTag);

			let exists = await service.run("temporary-tag");
			expect(exists).toBe(true);

			repository.clear();

			exists = await service.run("temporary-tag");
			expect(exists).toBe(false);
		});

		it("should handle special characters in slug", async () => {
			const postTag = PostTag.make({
				name: "Special Tag",
				slug: "special-tag-with-123",
				hidden: false,
			});

			await repository.create(postTag);

			const exists = await service.run("special-tag-with-123");

			expect(exists).toBe(true);
		});

		it("should return false for partial slug matches", async () => {
			const postTag = PostTag.make({
				name: "Full Slug Tag",
				slug: "full-slug-tag",
				hidden: false,
			});

			await repository.create(postTag);

			const existsPartial = await service.run("full-slug");
			const existsFull = await service.run("full-slug-tag");

			expect(existsPartial).toBe(false);
			expect(existsFull).toBe(true);
		});
	});
});
