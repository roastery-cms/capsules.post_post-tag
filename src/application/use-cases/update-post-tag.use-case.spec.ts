import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdatePostTagUseCase } from "./update-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { SlugUniquenessCheckerService } from "@caffeine/domain/services";
import { FindPostTagUseCase } from "./find-post-tag.use-case";
import {
	InvalidOperationException,
	ResourceAlreadyExistsException,
} from "@caffeine/errors/application";
import type { FindEntityByTypeUseCase } from "@caffeine/application/use-cases";
import { PostTag } from "@/domain";
import { makeEntity } from "@caffeine/entity/factories";
import { generateUUID } from "@caffeine/entity/helpers";
import type { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";

describe("UpdatePostTagUseCase", () => {
	let useCase: UpdatePostTagUseCase;
	let repository: PostTagRepository;
	let uniquenessChecker: IPostTagUniquenessCheckerService;
	let findPostTag: FindPostTagUseCase;
	let findEntityByType: FindEntityByTypeUseCase<
		typeof UnpackedPostTagDTO,
		IPostTag,
		IPostTagReader
	>;

	beforeEach(() => {
		repository = new PostTagRepository();
		uniquenessChecker = new SlugUniquenessCheckerService(
			repository,
		) as unknown as IPostTagUniquenessCheckerService;

		findEntityByType = {
			run: vi.fn().mockImplementation(async (id: string) => {
				const tag = await repository.findById(id);
				if (!tag) throw new Error("Not found");
				return tag;
			}),
		} as unknown as FindEntityByTypeUseCase<
			typeof UnpackedPostTagDTO,
			IPostTag,
			IPostTagReader
		>;

		findPostTag = new FindPostTagUseCase(findEntityByType);
		useCase = new UpdatePostTagUseCase(
			repository,
			findPostTag,
			uniquenessChecker,
		);
	});

	const createStoredTag = async (name: string, slug?: string) => {
		const id = generateUUID();
		const entityProps = makeEntity();
		entityProps.id = id;

		const tag = PostTag.make(
			{ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") },
			entityProps,
		);
		await repository.create(tag);
		return tag;
	};

	it("should rename the post tag successfully without updating slug", async () => {
		const storedTag = await createStoredTag("Old Name", "old-name");
		const result = await useCase.run(storedTag.id, { name: "New Name" });

		expect(result.name).toBe("New Name");
		expect(result.slug).toBe("old-name");

		const updatedTag = await repository.findById(storedTag.id);
		expect(updatedTag?.name).toBe("New Name");
		expect(updatedTag?.slug).toBe("old-name");
	});

	it("should rename and reslug successfully when updateSlug is true", async () => {
		const storedTag = await createStoredTag("Old Name", "old-name");
		const result = await useCase.run(
			storedTag.id,
			{ name: "New Awesome Name" },
			true,
		);

		expect(result.name).toBe("New Awesome Name");
		expect(result.slug).toBe("new-awesome-name");

		const updatedTag = await repository.findById(storedTag.id);
		expect(updatedTag?.name).toBe("New Awesome Name");
		expect(updatedTag?.slug).toBe("new-awesome-name");
	});

	it("should update slug explicitly", async () => {
		const storedTag = await createStoredTag("Old Name", "old-name");
		const result = await useCase.run(storedTag.id, {
			slug: "explicit-new-slug",
		});

		expect(result.name).toBe("Old Name");
		expect(result.slug).toBe("explicit-new-slug");

		const updatedTag = await repository.findById(storedTag.id);
		expect(updatedTag?.slug).toBe("explicit-new-slug");
	});

	it("should throw InvalidOperationException when trying to update name, updateSlug=true, and explicit slug", async () => {
		const storedTag = await createStoredTag("Old Name", "old-name");

		await expect(
			useCase.run(storedTag.id, { name: "New Name", slug: "new-slug" }, true),
		).rejects.toThrow(InvalidOperationException);
	});

	it("should throw ResourceAlreadyExistsException when new slug from name already exists", async () => {
		await createStoredTag("Existing Tag", "existing-tag");
		const storedTag = await createStoredTag("Old Name", "old-name");

		await expect(
			useCase.run(storedTag.id, { name: "Existing Tag" }, true),
		).rejects.toThrow(ResourceAlreadyExistsException);
	});

	it("should throw ResourceAlreadyExistsException when explicitly provided slug already exists", async () => {
		await createStoredTag("Existing Tag", "existing-tag");
		const storedTag = await createStoredTag("Old Name", "old-name");

		await expect(
			useCase.run(storedTag.id, { slug: "existing-tag" }),
		).rejects.toThrow(ResourceAlreadyExistsException);
	});

	it("should not throw if the new slug is exactly the same as the current one", async () => {
		const storedTag = await createStoredTag("Same Name", "same-name");

		const result = await useCase.run(storedTag.id, { name: "Same Name" }, true);
		expect(result.slug).toBe("same-name");
	});

	it("should change visibility successfully", async () => {
		const storedTag = await createStoredTag("Visible Tag");

		const result = await useCase.run(storedTag.id, { hidden: true });
		expect(result.hidden).toBe(true);

		const updatedTag = await repository.findById(storedTag.id);
		expect(updatedTag?.hidden).toBe(true);
	});
});
