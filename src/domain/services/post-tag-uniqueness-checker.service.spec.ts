import { describe, expect, it } from "vitest";
import { PostTagUniquenessChecker } from "./post-tag-uniqueness-checker.service";
import { PostTagRepository } from "../../infra/repositories/test/post-tag.repository";
import { PostTag } from "@/domain/post-tag";

describe("PostTagUniquenessChecker Service", () => {
	it("should return true if slug is unique", async () => {
		const repository = new PostTagRepository();
		const checker = new PostTagUniquenessChecker(repository);
		const unique = await checker.run("unique-slug");
		expect(unique).toBe(true);
	});

	it("should return false if slug exists", async () => {
		const repository = new PostTagRepository();
		const existingTag = PostTag.make({
			name: "Existing Tag",
			slug: "existing-slug",
			hidden: false,
		});
		await repository.create(existingTag);

		const checker = new PostTagUniquenessChecker(repository);
		const unique = await checker.run("existing-slug");
		expect(unique).toBe(false);
	});
});
