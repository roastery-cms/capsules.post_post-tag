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

	it("should derive slug from name when slug is not provided", () => {
		const postTag = PostTag.make({
			name: "Auto Slug Tag",
			hidden: false,
		});

		expect(postTag.slug).toBe("auto-slug-tag");
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

	it("should rename without updating slug when updateSlug is false", () => {
		const postTag = PostTag.make({
			name: "Original",
			slug: "original",
			hidden: false,
		});

		postTag.rename("New Name");

		expect(postTag.name).toBe("New Name");
		expect(postTag.slug).toBe("original");
	});

	it("should reslug without changing the name", () => {
		const postTag = PostTag.make({
			name: "Keep This Name",
			slug: "old-slug",
			hidden: false,
		});

		postTag.reslug("new-slug-value");

		expect(postTag.name).toBe("Keep This Name");
		expect(postTag.slug).toBe("new-slug-value");
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
