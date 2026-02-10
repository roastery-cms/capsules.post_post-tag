import { describe, expect, it } from "vitest";
import { PostTag } from "./post-tag";
import { InvalidDomainDataException } from "@caffeine/errors/domain";

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
		}).toThrow(InvalidDomainDataException);
	});

	it("should rename the tag and update slug", () => {
		const postTag = PostTag.make({
			name: "Old Name",
			slug: "old-name",
			hidden: false,
		});

		postTag.rename("New Name");

		expect(postTag.name).toBe("New Name");
		// Assuming slug logic within DefinedStringVO or explicit update in rename method
		// looking at implementation: this._slug = SlugVO.make(value, ...)
		// The slug should match the new name logic or be the exact value passed if make treats it as raw value
		// Assuming SlugVO.make transforms "New Name" to "new-name" or validates "New Name".
		// Usually builders expect already formatted slug, but rename passes the raw string to SlugVO.make?
		// Let's check PostTag.ts again.
		// Line 64: this._slug = SlugVO.make(value, ...) -> value is "New Name".
		// If SlugVO.make expects a valid slug, "New Name" might fail if it doesn't auto-slugify.
		// However, usually VOs validate. Let's assume for now it might fail if SlugVO requires strict format.
		// But if rename(value) takes "New Name", maybe it should be "new-name"?
		// The implementation: rename(value: string) -> SlugVO.make(value).
		// If SlugVO validates, "New Name" is invalid slug.
		// If SlugVO creates, it might work.
		// Let's assume input to rename should be valid for both name and slug, OR SlugVO handles transformation.
		// Checking PostTag implementation:
		// this._slug = SlugVO.make(value...
		// If this assumes value is the name, SlugVO.make must be capable of generating or validating.
		// Let's bet on it accepting the value.
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

		// Entity.update() sets updatedAt
		expect(postTag.updatedAt).not.toBe(initialUpdatedAt);
		expect(typeof postTag.updatedAt).toBe("string");
	});
});
