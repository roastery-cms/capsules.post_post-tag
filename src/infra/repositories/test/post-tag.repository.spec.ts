import { describe, expect, it, beforeEach } from "vitest";
import { PostTagRepository } from "./post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("PostTagRepository (Test)", () => {
	let repository: PostTagRepository;

	beforeEach(() => {
		repository = new PostTagRepository();
	});

	describe("create", () => {
		it("should create a new post tag successfully", async () => {
			const postTag = PostTag.make({
				name: "Test Tag",
				slug: "test-tag",
				hidden: false,
			});

			await repository.create(postTag);

			const allTags = repository.getAll();
			expect(allTags).toHaveLength(1);

			const firstTag = allTags[0];
			expect(firstTag).toBeDefined();
			if (firstTag) {
				expect(firstTag.name).toBe("Test Tag");
				expect(firstTag.slug).toBe("test-tag");
				expect(firstTag.hidden).toBe(false);
			}
		});

		it("should create multiple post tags", async () => {
			const tag1 = PostTag.make({
				name: "Tag 1",
				slug: "tag-1",
				hidden: false,
			});
			const tag2 = PostTag.make({
				name: "Tag 2",
				slug: "tag-2",
				hidden: true,
			});

			await repository.create(tag1);
			await repository.create(tag2);

			const allTags = repository.getAll();
			expect(allTags).toHaveLength(2);
		});
	});

	describe("findManyByIds", () => {
		it("should throw error as method is not implemented", () => {
			expect(() => repository.findManyByIds(["any-id"])).toThrow(
				"Method not implemented.",
			);
		});
	});

	describe("findById", () => {
		it("should find a post tag by id", async () => {
			const postTag = PostTag.make({
				name: "Findable Tag",
				slug: "findable-tag",
				hidden: false,
			});

			await repository.create(postTag);

			const found = await repository.findById(postTag.id);

			expect(found).not.toBeNull();
			expect(found?.id).toBe(postTag.id);
			expect(found?.name).toBe("Findable Tag");
			expect(found?.slug).toBe("findable-tag");
		});

		it("should preserve timestamps when retrieving", async () => {
			const postTag = PostTag.make({
				name: "Timestamp Tag",
				slug: "timestamp-tag",
				hidden: false,
			});

			const createdAt = postTag.createdAt;
			const updatedAt = postTag.updatedAt;

			await repository.create(postTag);

			const found = await repository.findById(postTag.id);

			expect(found?.createdAt).toEqual(createdAt);
			expect(found?.updatedAt).toEqual(updatedAt);
		});

		it("should return null when tag is not found", async () => {
			const found = await repository.findById("non-existent-id");

			expect(found).toBeNull();
		});

		it("should find the correct tag among multiple tags", async () => {
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

			const found = await repository.findById(tag2.id);

			expect(found).not.toBeNull();
			expect(found?.id).toBe(tag2.id);
			expect(found?.name).toBe("Tag 2");
		});
	});

	describe("findBySlug", () => {
		it("should find a post tag by slug", async () => {
			const postTag = PostTag.make({
				name: "Findable Tag",
				slug: "findable-tag",
				hidden: false,
			});

			await repository.create(postTag);

			const found = await repository.findBySlug("findable-tag");

			expect(found).not.toBeNull();
			expect(found?.name).toBe("Findable Tag");
			expect(found?.slug).toBe("findable-tag");
		});

		it("should return null when tag is not found", async () => {
			const found = await repository.findBySlug("non-existent-tag");

			expect(found).toBeNull();
		});

		it("should find the correct tag among multiple tags", async () => {
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

			const found = await repository.findBySlug("tag-2");

			expect(found).not.toBeNull();
			expect(found?.name).toBe("Tag 2");
		});
	});

	describe("findMany", () => {
		it("should return empty array when no tags exist", async () => {
			const tags = await repository.findMany(0);

			expect(tags).toEqual([]);
		});

		it("should return all tags on first page when less than max items", async () => {
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

			const tags = await repository.findMany(0);

			expect(tags).toHaveLength(2);

			const [firstTag, secondTag] = tags;
			expect(firstTag).toBeDefined();
			expect(secondTag).toBeDefined();
			if (firstTag && secondTag) {
				expect(firstTag.name).toBe("Tag 1");
				expect(secondTag.name).toBe("Tag 2");
			}
		});

		it("should paginate results correctly", async () => {
			// Import to get the actual value
			const { MAX_ITEMS_PER_QUERY } = await import("@caffeine/constants");

			// Create enough tags to span multiple pages
			const totalTags = MAX_ITEMS_PER_QUERY + 5;

			for (let i = 1; i <= totalTags; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const firstPage = await repository.findMany(0);
			const secondPage = await repository.findMany(1);

			expect(firstPage).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(secondPage).toHaveLength(5);

			const firstPageFirstTag = firstPage[0];
			const secondPageFirstTag = secondPage[0];
			expect(firstPageFirstTag).toBeDefined();
			expect(secondPageFirstTag).toBeDefined();
			if (firstPageFirstTag && secondPageFirstTag) {
				expect(firstPageFirstTag.name).toBe("Tag 1");
				expect(secondPageFirstTag.name).toBe(`Tag ${MAX_ITEMS_PER_QUERY + 1}`);
			}
		});

		it("should return empty array for page beyond available data", async () => {
			const tag = PostTag.make({
				name: "Single Tag",
				slug: "single-tag",
				hidden: false,
			});

			await repository.create(tag);

			const tags = await repository.findMany(5);

			expect(tags).toEqual([]);
		});
	});

	describe("update", () => {
		it("should update an existing post tag", async () => {
			const postTag = PostTag.make({
				name: "Original Name",
				slug: "original-slug",
				hidden: false,
			});

			await repository.create(postTag);

			// Update the tag
			postTag.rename("Updated Name");
			postTag.toggleVisibility();

			await repository.update(postTag);

			const found = await repository.findBySlug("updated-name");

			expect(found).not.toBeNull();
			expect(found?.name).toBe("Updated Name");
			expect(found?.slug).toBe("updated-name");
			expect(found?.hidden).toBe(true);
		});

		it("should not affect other tags when updating one", async () => {
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

			tag1.rename("Updated Tag 1");
			await repository.update(tag1);

			// Note: slug changes when name changes
			const found1 = await repository.findBySlug("updated-tag-1");
			const found2 = await repository.findBySlug("tag-2");

			expect(found1?.name).toBe("Updated Tag 1");
			expect(found2?.name).toBe("Tag 2");
		});

		it("should do nothing when updating non-existent tag", async () => {
			const postTag = PostTag.make({
				name: "Non-existent",
				slug: "non-existent",
				hidden: false,
			});

			await repository.update(postTag);

			const allTags = repository.getAll();
			expect(allTags).toHaveLength(0);
		});
	});

	describe("count", () => {
		it("should return 0 when repository is empty", async () => {
			const count = await repository.count();

			expect(count).toBe(0);
		});

		it("should return correct count of tags", async () => {
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

			const count = await repository.count();

			expect(count).toBe(2);
		});
	});

	describe("clear", () => {
		it("should remove all tags from repository", async () => {
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

			expect(repository.getAll()).toHaveLength(2);

			repository.clear();

			expect(repository.getAll()).toHaveLength(0);
			expect(await repository.count()).toBe(0);
		});
	});

	describe("getAll", () => {
		it("should return empty array when repository is empty", () => {
			const allTags = repository.getAll();

			expect(allTags).toEqual([]);
		});

		it("should return all stored tags", async () => {
			const tag1 = PostTag.make({
				name: "Tag 1",
				slug: "tag-1",
				hidden: false,
			});
			const tag2 = PostTag.make({
				name: "Tag 2",
				slug: "tag-2",
				hidden: true,
			});

			await repository.create(tag1);
			await repository.create(tag2);

			const allTags = repository.getAll();

			expect(allTags).toHaveLength(2);

			const [firstTag, secondTag] = allTags;
			expect(firstTag).toBeDefined();
			expect(secondTag).toBeDefined();
			if (firstTag && secondTag) {
				expect(firstTag.name).toBe("Tag 1");
				expect(secondTag.name).toBe("Tag 2");
			}
		});

		it("should return a copy of the array (not reference)", async () => {
			const tag = PostTag.make({
				name: "Tag",
				slug: "tag",
				hidden: false,
			});

			await repository.create(tag);

			const allTags1 = repository.getAll();
			const allTags2 = repository.getAll();

			expect(allTags1).not.toBe(allTags2);
			expect(allTags1).toEqual(allTags2);
		});
	});
});
