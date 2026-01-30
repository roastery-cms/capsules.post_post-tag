import { describe, expect, it, beforeEach } from "vitest";
import { GetPostTagsByPageUseCase } from "./get-post-tags-by-page.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain/post-tag";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";

describe("GetPostTagsByPageUseCase", () => {
	let repository: PostTagRepository;
	let useCase: GetPostTagsByPageUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new GetPostTagsByPageUseCase(repository);
	});

	describe("run", () => {
		it("should return empty array when repository is empty", async () => {
			const result = await useCase.run(0);

			expect(result).toEqual([]);
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

			const result = await useCase.run(0);

			expect(result).toHaveLength(2);

			const [firstTag, secondTag] = result;
			if (firstTag && secondTag) {
				expect(firstTag.name).toBe("Tag 1");
				expect(secondTag.name).toBe("Tag 2");
			}
		});

		it("should return correct page of tags", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY + 5; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const firstPage = await useCase.run(0);
			const secondPage = await useCase.run(1);

			expect(firstPage).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(secondPage).toHaveLength(5);
		});

		it("should return tags in order they were created", async () => {
			const tag1 = PostTag.make({
				name: "First",
				slug: "first",
				hidden: false,
			});
			const tag2 = PostTag.make({
				name: "Second",
				slug: "second",
				hidden: false,
			});
			const tag3 = PostTag.make({
				name: "Third",
				slug: "third",
				hidden: false,
			});

			await repository.create(tag1);
			await repository.create(tag2);
			await repository.create(tag3);

			const result = await useCase.run(0);

			expect(result).toHaveLength(3);

			const [first, second, third] = result;
			if (first && second && third) {
				expect(first.name).toBe("First");
				expect(second.name).toBe("Second");
				expect(third.name).toBe("Third");
			}
		});

		it("should include hidden tags in results", async () => {
			const visibleTag = PostTag.make({
				name: "Visible",
				slug: "visible",
				hidden: false,
			});
			const hiddenTag = PostTag.make({
				name: "Hidden",
				slug: "hidden",
				hidden: true,
			});

			await repository.create(visibleTag);
			await repository.create(hiddenTag);

			const result = await useCase.run(0);

			expect(result).toHaveLength(2);

			const foundHidden = result.find((tag) => tag.hidden === true);
			expect(foundHidden).toBeDefined();
			if (foundHidden) {
				expect(foundHidden.name).toBe("Hidden");
			}
		});

		it("should return empty array for page beyond available data", async () => {
			const tag = PostTag.make({
				name: "Single Tag",
				slug: "single-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run(5);

			expect(result).toEqual([]);
		});

		it("should return all properties of unmounted tags", async () => {
			const tag = PostTag.make({
				name: "Complete Tag",
				slug: "complete-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run(0);

			expect(result).toHaveLength(1);

			const returnedTag = result[0];
			if (returnedTag) {
				expect(returnedTag).toHaveProperty("id");
				expect(returnedTag).toHaveProperty("name");
				expect(returnedTag).toHaveProperty("slug");
				expect(returnedTag).toHaveProperty("hidden");
				expect(returnedTag).toHaveProperty("createdAt");
				expect(returnedTag).toHaveProperty("updatedAt");
			}
		});

		it("should handle exactly one page of items", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const firstPage = await useCase.run(0);
			const secondPage = await useCase.run(1);

			expect(firstPage).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(secondPage).toEqual([]);
		});

		it("should correctly paginate multiple pages", async () => {
			const totalItems = MAX_ITEMS_PER_QUERY * 3;

			for (let i = 1; i <= totalItems; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const page0 = await useCase.run(0);
			const page1 = await useCase.run(1);
			const page2 = await useCase.run(2);
			const page3 = await useCase.run(3);

			expect(page0).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(page1).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(page2).toHaveLength(MAX_ITEMS_PER_QUERY);
			expect(page3).toEqual([]);
		});

		it("should return different items for different pages", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY + 2; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const firstPage = await useCase.run(0);
			const secondPage = await useCase.run(1);

			const firstPageFirstItem = firstPage[0];
			const secondPageFirstItem = secondPage[0];

			if (firstPageFirstItem && secondPageFirstItem) {
				expect(firstPageFirstItem.name).toBe("Tag 1");
				expect(secondPageFirstItem.name).toBe(`Tag ${MAX_ITEMS_PER_QUERY + 1}`);
			}
		});
	});
});
