import { describe, expect, it } from "vitest";
import { PostTag } from "./post-tag";
import { InvalidPropertyException } from "@caffeine/errors/domain";

describe("PostTag Entity", () => {
	it("should be able to create a new post tag", () => {
		const postTag = PostTag.make({
			name: "Valid Tag",
			slug: "valid-tag",
			hidden: false,
		});

		expect(postTag).toBeInstanceOf(PostTag);
		expect(postTag.name).toBe("Valid Tag");
		expect(postTag.slug).toBe("valid-tag");
		expect(postTag.hidden).toBe(false);
		expect(postTag.id).toBeDefined();
		expect(typeof postTag.createdAt).toBe("string");
		expect(postTag.updatedAt).toBeFalsy();
	});

	it("should throw error if name is empty", () => {
		expect(() => {
			PostTag.make({
				name: "",
				slug: "valid-slug",
				hidden: false,
			});
		}).toThrow(InvalidPropertyException);
	});

	it("should rename the tag and update slug", () => {
		const postTag = PostTag.make({
			name: "Old Name",
			slug: "old-name",
			hidden: false,
		});

		postTag.rename("New Name");

		expect(postTag.name).toBe("New Name");
	});

	it("should toggle visibility", () => {
		const postTag = PostTag.make({
			name: "Tag",
			slug: "tag",
			hidden: false,
		});

		postTag.toggleVisibility();
		expect(postTag.hidden).toBe(true);

		postTag.toggleVisibility();
		expect(postTag.hidden).toBe(false);
	});

	it("should update updatedAt when modified", () => {
		const postTag = PostTag.make({
			name: "Tag",
			slug: "tag",
			hidden: false,
		});

		const initialUpdatedAt = postTag.updatedAt;

		postTag.rename("Updated Tag");

		expect(postTag.updatedAt).not.toBe(initialUpdatedAt);
		expect(typeof postTag.updatedAt).toBe("string");
	});
});
