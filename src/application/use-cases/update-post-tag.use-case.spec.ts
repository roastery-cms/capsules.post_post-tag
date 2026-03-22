import { describe, it, expect, beforeEach, mock } from "bun:test";
import { UpdatePostTagUseCase } from "./update-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { FindPostTagUseCase } from "./find-post-tag.use-case";
import { PostTag } from "@/domain";
import type { UnpackedPostTagDTO } from "@/domain/dtos";
import type { IPostTag } from "@/domain/types";
import type { IPostTagReader } from "@/domain/types/post-tag-reader.interface";
import type { IPostTagUniquenessCheckerService } from "@/domain/types/services";
import type { FindEntityByTypeUseCase } from "@roastery/seedbed/application/use-cases";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";
import { makeEntity } from "@roastery/beans/entity/factories";
import { generateUUID } from "@roastery/beans/entity/helpers";
import {
	InvalidOperationException,
	ResourceAlreadyExistsException,
} from "@roastery/terroir/exceptions/application";

describe("UpdatePostTagUseCase", () => {
	let useCase: UpdatePostTagUseCase;
	let repository: PostTagRepository;

	beforeEach(() => {
		repository = new PostTagRepository();
		const uniquenessChecker = new SlugUniquenessCheckerService(
			repository,
		) as unknown as IPostTagUniquenessCheckerService;

		const findEntityByType = {
			run: mock(async (id: string) => {
				const tag = await repository.findById(id);
				if (!tag) throw new Error("Not found");
				return tag;
			}),
		} as unknown as FindEntityByTypeUseCase<
			typeof UnpackedPostTagDTO,
			IPostTag,
			IPostTagReader
		>;

		const findPostTag = new FindPostTagUseCase(findEntityByType);
		useCase = new UpdatePostTagUseCase(
			repository,
			findPostTag,
			uniquenessChecker,
		);
	});

	const createStoredTag = async (name: string, slug?: string) => {
		const entityProps = makeEntity();
		entityProps.id = generateUUID();

		const tag = PostTag.make(
			{ name, slug: slug ?? name.toLowerCase().replace(/\s+/g, "-") },
			entityProps,
		);
		await repository.create(tag);
		return tag;
	};

	describe("rename", () => {
		it("should rename without updating the slug", async () => {
			const storedTag = await createStoredTag("Old Name", "old-name");
			const result = await useCase.run(storedTag.id, { name: "New Name" });

			expect(result.name).toBe("New Name");
			expect(result.slug).toBe("old-name");

			const persisted = await repository.findById(storedTag.id);
			expect(persisted!.name).toBe("New Name");
			expect(persisted!.slug).toBe("old-name");
		});

		it("should rename and reslug when updateSlug is true", async () => {
			const storedTag = await createStoredTag("Old Name", "old-name");
			const result = await useCase.run(
				storedTag.id,
				{ name: "New Awesome Name" },
				true,
			);

			expect(result.name).toBe("New Awesome Name");
			expect(result.slug).toBe("new-awesome-name");

			const persisted = await repository.findById(storedTag.id);
			expect(persisted!.name).toBe("New Awesome Name");
			expect(persisted!.slug).toBe("new-awesome-name");
		});
	});

	describe("reslug", () => {
		it("should update slug explicitly without changing the name", async () => {
			const storedTag = await createStoredTag("Old Name", "old-name");
			const result = await useCase.run(storedTag.id, {
				slug: "explicit-new-slug",
			});

			expect(result.name).toBe("Old Name");
			expect(result.slug).toBe("explicit-new-slug");
		});

		it("should not throw if the new slug equals the current one", async () => {
			const storedTag = await createStoredTag("Same Name", "same-name");

			const result = await useCase.run(
				storedTag.id,
				{ name: "Same Name" },
				true,
			);
			expect(result.slug).toBe("same-name");
		});
	});

	describe("changeVisibility", () => {
		it("should change visibility and persist", async () => {
			const storedTag = await createStoredTag("Visible Tag");

			const result = await useCase.run(storedTag.id, { hidden: true });
			expect(result.hidden).toBe(true);

			const persisted = await repository.findById(storedTag.id);
			expect(persisted!.hidden).toBe(true);
		});
	});

	describe("validation", () => {
		it("should throw InvalidOperationException when updateSlug=true with explicit slug", async () => {
			const storedTag = await createStoredTag("Old Name", "old-name");

			await expect(
				useCase.run(storedTag.id, { name: "New Name", slug: "new-slug" }, true),
			).rejects.toThrow(InvalidOperationException);
		});

		it("should throw ResourceAlreadyExistsException when derived slug already exists", async () => {
			await createStoredTag("Existing Tag", "existing-tag");
			const storedTag = await createStoredTag("Old Name", "old-name");

			await expect(
				useCase.run(storedTag.id, { name: "Existing Tag" }, true),
			).rejects.toThrow(ResourceAlreadyExistsException);
		});

		it("should throw ResourceAlreadyExistsException when explicit slug already exists", async () => {
			await createStoredTag("Existing Tag", "existing-tag");
			const storedTag = await createStoredTag("Old Name", "old-name");

			await expect(
				useCase.run(storedTag.id, { slug: "existing-tag" }),
			).rejects.toThrow(ResourceAlreadyExistsException);
		});
	});
});
