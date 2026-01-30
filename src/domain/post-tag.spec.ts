import { describe, expect, it } from "vitest";
import { InvalidDomainDataException } from "@caffeine/errors/domain";
import { PostTag } from "./post-tag";

describe("PostTag Entity", () => {
	it("should create a new PostTag instance successfully with valid data", () => {
		const validProps = {
			name: "Test Tag",
			slug: "test-tag",
			hidden: false,
		};

		const postTag = PostTag.make(validProps);

		expect(postTag).toBeInstanceOf(PostTag);
		expect(postTag.name).toBe(validProps.name);
		expect(postTag.slug).toBe(validProps.slug);
		expect(postTag.hidden).toBe(validProps.hidden);
		expect(postTag.id).toBeDefined();
		expect(postTag.createdAt).toBeTypeOf("string");
	});

	it("should throw InvalidDomainDataException when creating with invalid data", () => {
		const invalidProps = {
			name: "", // Invalid: minLength 1
			slug: "invalid-tag",
			hidden: false,
		};

		expect(() => PostTag.make(invalidProps)).toThrow(
			InvalidDomainDataException,
		);
	});

	it("should unpack the entity correctly", () => {
		const validProps = {
			name: "Unpack Test",
			slug: "unpack-test",
			hidden: true,
		};

		const postTag = PostTag.make(validProps);
		const unpacked = postTag.unpack();

		expect(unpacked).toEqual({
			id: postTag.id,
			createdAt: postTag.createdAt,
			updatedAt: postTag.updatedAt,
			name: validProps.name,
			slug: validProps.slug,
			hidden: validProps.hidden,
		});
		expect(unpacked).not.toBeInstanceOf(PostTag);
	});
});
