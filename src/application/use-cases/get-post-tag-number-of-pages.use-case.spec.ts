import { describe, expect, it, beforeEach } from "vitest";
import { GetPostTypeNumberOfPagesUseCase } from "./get-post-tag-number-of-pages.use-case";
import { PostTagRepository } from "@/infra/repositories/test";
import { PostTag } from "@/domain/post-tag";
import { MAX_ITEMS_PER_QUERY } from "@caffeine/constants";

describe("GetPostTypeNumberOfPagesUseCase", () => {
	let repository: PostTagRepository;
	let useCase: GetPostTypeNumberOfPagesUseCase;

	beforeEach(() => {
		repository = new PostTagRepository();
		useCase = new GetPostTypeNumberOfPagesUseCase(repository);
	});

	describe("run", () => {
		it("should return 0 pages when repository is empty", async () => {
			const result = await useCase.run();

			expect(result).toBe(0);
		});

		it("should return 1 page when there are fewer items than max per query", async () => {
			// Create half of MAX_ITEMS_PER_QUERY
			const itemsToCreate = Math.floor(MAX_ITEMS_PER_QUERY / 2);

			for (let i = 1; i <= itemsToCreate; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(1);
		});

		it("should return 1 page when there are exactly max items per query", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(1);
		});

		it("should return 2 pages when there are max items + 1", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY + 1; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(2);
		});

		it("should correctly calculate pages for multiple pages", async () => {
			const totalItems = MAX_ITEMS_PER_QUERY * 2 + 5;

			for (let i = 1; i <= totalItems; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(3);
		});

		it("should round up to next page when there are remaining items", async () => {
			const totalItems =
				MAX_ITEMS_PER_QUERY + Math.floor(MAX_ITEMS_PER_QUERY / 2);

			for (let i = 1; i <= totalItems; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(2);
		});

		it("should count hidden tags in pagination", async () => {
			for (let i = 1; i <= MAX_ITEMS_PER_QUERY + 1; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: i % 2 === 0, // Every other tag is hidden
				});
				await repository.create(tag);
			}

			const result = await useCase.run();

			expect(result).toBe(2);
		});

		it("should return correct number after tags are added", async () => {
			// Start with half a page
			for (let i = 1; i <= Math.floor(MAX_ITEMS_PER_QUERY / 2); i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			let result = await useCase.run();
			expect(result).toBe(1);

			// Add more to exceed one page
			for (
				let i = Math.floor(MAX_ITEMS_PER_QUERY / 2) + 1;
				i <= MAX_ITEMS_PER_QUERY + 1;
				i++
			) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			result = await useCase.run();
			expect(result).toBe(2);
		});

		it("should handle single item correctly", async () => {
			const tag = PostTag.make({
				name: "Single Tag",
				slug: "single-tag",
				hidden: false,
			});
			await repository.create(tag);

			const result = await useCase.run();

			expect(result).toBe(1);
		});

		it("should use Math.ceil for proper rounding", async () => {
			// Create exactly 1.5 pages worth of items
			const totalItems =
				MAX_ITEMS_PER_QUERY + Math.floor(MAX_ITEMS_PER_QUERY / 2);

			for (let i = 1; i <= totalItems; i++) {
				const tag = PostTag.make({
					name: `Tag ${i}`,
					slug: `tag-${i}`,
					hidden: false,
				});
				await repository.create(tag);
			}

			const result = await useCase.run();
			const expected = Math.ceil(totalItems / MAX_ITEMS_PER_QUERY);

			expect(result).toBe(expected);
			expect(result).toBe(2);
		});
	});
});
