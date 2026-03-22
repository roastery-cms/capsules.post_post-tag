import { describe, expect, it } from "bun:test";
import { PostTag } from "./post-tag";
import { makeEntity } from "@roastery/beans/entity/factories";
import { InvalidPropertyException } from "@roastery/terroir/exceptions/domain";
import { EntitySource } from "@roastery/beans/entity/symbols";

describe("PostTag Entity", () => {
	describe("make", () => {
		it("should create a post tag with all properties", () => {
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
			const postTag = PostTag.make({ name: "Auto Slug Tag" });

			expect(postTag.slug).toBe("auto-slug-tag");
		});

		it("should slugify the name with uppercase and special characters", () => {
			const postTag = PostTag.make({ name: "Hello World! @2024" });

			expect(postTag.slug).toBe("hello-world-2024");
		});

		it("should default hidden to false when not provided", () => {
			const postTag = PostTag.make({
				name: "Tag Without Hidden",
				slug: "tag-without-hidden",
			});

			expect(postTag.hidden).toBe(false);
		});

		it("should throw InvalidPropertyException if name is empty", () => {
			expect(() => {
				PostTag.make({ name: "", slug: "valid-slug", hidden: false });
			}).toThrow(InvalidPropertyException);
		});

		it("should restore entity from persisted data (rehydration)", () => {
			const entityProps = {
				...makeEntity(),
				updatedAt: new Date().toISOString(),
			};

			const postTag = PostTag.make(
				{ name: "Rehydrated Tag", slug: "rehydrated-tag", hidden: true },
				entityProps,
			);

			expect(postTag.id).toBe(entityProps.id);
			expect(postTag.createdAt).toBe(entityProps.createdAt);
			expect(postTag.updatedAt).toBe(entityProps.updatedAt);
			expect(postTag.name).toBe("Rehydrated Tag");
			expect(postTag.slug).toBe("rehydrated-tag");
			expect(postTag.hidden).toBe(true);
		});
	});

	describe("EntitySource", () => {
		it("should expose the correct source identifier on the class", () => {
			expect(PostTag[EntitySource]).toBe("post@post-tag");
		});
	});

	describe("rename", () => {
		it("should update the name without changing the slug", () => {
			const postTag = PostTag.make({
				name: "Original Name",
				slug: "original",
				hidden: false,
			});

			postTag.rename("New Name");

			expect(postTag.name).toBe("New Name");
			expect(postTag.slug).toBe("original");
		});

		it("should set updatedAt after renaming", () => {
			const postTag = PostTag.make({ name: "Tag", slug: "tag" });
			const initialUpdatedAt = postTag.updatedAt;

			postTag.rename("Updated Tag");

			expect(postTag.updatedAt).not.toBe(initialUpdatedAt);
			expect(typeof postTag.updatedAt).toBe("string");
		});

		it("should throw InvalidPropertyException if new name is empty", () => {
			const postTag = PostTag.make({ name: "Tag", slug: "tag" });

			expect(() => postTag.rename("")).toThrow(InvalidPropertyException);
		});
	});

	describe("reslug", () => {
		it("should update the slug without changing the name", () => {
			const postTag = PostTag.make({
				name: "Keep This Name",
				slug: "old-slug",
				hidden: false,
			});

			postTag.reslug("new-slug-value");

			expect(postTag.name).toBe("Keep This Name");
			expect(postTag.slug).toBe("new-slug-value");
		});

		it("should set updatedAt after reslugging", () => {
			const postTag = PostTag.make({ name: "Tag", slug: "tag" });
			const initialUpdatedAt = postTag.updatedAt;

			postTag.reslug("new-slug");

			expect(postTag.updatedAt).not.toBe(initialUpdatedAt);
			expect(typeof postTag.updatedAt).toBe("string");
		});

		it("should throw InvalidPropertyException if new slug is empty", () => {
			const postTag = PostTag.make({ name: "Tag", slug: "tag" });

			expect(() => postTag.reslug("")).toThrow(InvalidPropertyException);
		});
	});

	describe("changeVisibility", () => {
		it("should toggle visibility", () => {
			const postTag = PostTag.make({
				name: "Tag",
				slug: "tag",
				hidden: false,
			});

			postTag.changeVisibility(true);
			expect(postTag.hidden).toBe(true);

			postTag.changeVisibility(false);
			expect(postTag.hidden).toBe(false);
		});

		it("should set updatedAt after changing visibility", () => {
			const postTag = PostTag.make({ name: "Tag", slug: "tag" });
			const initialUpdatedAt = postTag.updatedAt;

			postTag.changeVisibility(true);

			expect(postTag.updatedAt).not.toBe(initialUpdatedAt);
			expect(typeof postTag.updatedAt).toBe("string");
		});
	});
});
