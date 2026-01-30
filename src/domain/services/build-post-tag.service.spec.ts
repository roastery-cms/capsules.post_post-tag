import { describe, expect, it } from "vitest";
import { BuildPostTag } from "./build-post-tag.service";
import { InvalidDomainDataException } from "@caffeine/errors/domain";
import type { IUnmountedPostTag } from "../types/unmounted-post-tag.interface";
import { PostTag } from "../post-tag";

describe("BuildPostTag Service", () => {
	describe("run", () => {
		it("should build a PostTag entity from valid unmounted data", () => {
			// Create a real PostTag and unpack it to get valid unmounted data
			const originalTag = PostTag.make({
				name: "Test Tag",
				slug: "test-tag",
				hidden: false,
			});
			const unmountedPostTag = originalTag.unpack();

			const postTag = BuildPostTag.run(unmountedPostTag);

			expect(postTag).toBeInstanceOf(PostTag);
			expect(postTag.id).toBe(unmountedPostTag.id);
			expect(postTag.name).toBe(unmountedPostTag.name);
			expect(postTag.slug).toBe(unmountedPostTag.slug);
			expect(postTag.hidden).toBe(unmountedPostTag.hidden);
			expect(postTag.createdAt).toBe(unmountedPostTag.createdAt);
			expect(postTag.updatedAt).toBe(unmountedPostTag.updatedAt);
		});

		it("should build a PostTag with hidden set to true", () => {
			const originalTag = PostTag.make({
				name: "Hidden Tag",
				slug: "hidden-tag",
				hidden: true,
			});
			const unmountedPostTag = originalTag.unpack();

			const postTag = BuildPostTag.run(unmountedPostTag);

			expect(postTag).toBeInstanceOf(PostTag);
			expect(postTag.hidden).toBe(true);
		});

		it("should preserve entity metadata (id, createdAt, updatedAt)", () => {
			// Create a tag and verify that when we rebuild it, metadata is preserved
			const originalTag = PostTag.make({
				name: "Metadata Tag",
				slug: "metadata-tag",
				hidden: false,
			});
			const unmountedPostTag = originalTag.unpack();

			const rebuiltTag = BuildPostTag.run(unmountedPostTag);

			// Metadata should be exactly the same
			expect(rebuiltTag.id).toBe(originalTag.id);
			expect(rebuiltTag.createdAt).toBe(originalTag.createdAt);
			expect(rebuiltTag.updatedAt).toBe(originalTag.updatedAt);
		});

		it("should throw InvalidDomainDataException when name is empty", () => {
			const invalidUnmountedPostTag = {
				id: "invalid-id",
				name: "", // Invalid: minLength 1
				slug: "invalid-tag",
				hidden: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			} as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should throw InvalidDomainDataException when slug is missing", () => {
			const invalidUnmountedPostTag = {
				id: "invalid-id",
				name: "Valid Name",
				// slug is missing
				hidden: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			} as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should throw InvalidDomainDataException when hidden is not a boolean", () => {
			const invalidUnmountedPostTag = {
				id: "invalid-id",
				name: "Valid Name",
				slug: "valid-slug",
				hidden: "not-a-boolean", // Invalid type
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			} as unknown as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should throw InvalidDomainDataException when id is missing", () => {
			const invalidUnmountedPostTag = {
				// id is missing
				name: "Valid Name",
				slug: "valid-slug",
				hidden: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			} as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should throw InvalidDomainDataException when createdAt is missing", () => {
			const invalidUnmountedPostTag = {
				id: "valid-id",
				name: "Valid Name",
				slug: "valid-slug",
				hidden: false,
				// createdAt is missing
				updatedAt: new Date().toISOString(),
			} as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should throw InvalidDomainDataException when updatedAt is missing", () => {
			const invalidUnmountedPostTag = {
				id: "valid-id",
				name: "Valid Name",
				slug: "valid-slug",
				hidden: false,
				createdAt: new Date().toISOString(),
				// updatedAt is missing
			} as IUnmountedPostTag;

			expect(() => BuildPostTag.run(invalidUnmountedPostTag)).toThrow(
				InvalidDomainDataException,
			);
		});

		it("should correctly separate entity properties from build properties", () => {
			const originalTag = PostTag.make({
				name: "Separation Test",
				slug: "separation-test",
				hidden: false,
			});
			const unmountedPostTag = originalTag.unpack();

			const postTag = BuildPostTag.run(unmountedPostTag);
			const unpacked = postTag.unpack();

			// Verify all properties are correctly preserved
			expect(unpacked).toEqual(unmountedPostTag);
		});

		it("should create a new instance, not return the same reference", () => {
			const originalTag = PostTag.make({
				name: "Reference Test",
				slug: "reference-test",
				hidden: false,
			});
			const unmountedPostTag = originalTag.unpack();

			const rebuiltTag = BuildPostTag.run(unmountedPostTag);

			expect(rebuiltTag).not.toBe(originalTag);
			expect(rebuiltTag.id).toBe(originalTag.id);
		});
	});
});
