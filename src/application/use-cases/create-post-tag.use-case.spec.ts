import { describe, it, expect, beforeEach } from "bun:test";
import { CreatePostTagUseCase } from "./create-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { SlugUniquenessCheckerService } from "@roastery/seedbed/domain/services";
import { ResourceAlreadyExistsException } from "@roastery/terroir/exceptions/application";

describe("CreatePostTagUseCase", () => {
	let useCase: CreatePostTagUseCase;
	let repository: PostTagRepository;

	beforeEach(() => {
		repository = new PostTagRepository();
		const uniquenessChecker = new SlugUniquenessCheckerService(repository);
		useCase = new CreatePostTagUseCase(repository, uniquenessChecker);
	});

	it("should create a post tag and persist it", async () => {
		const result = await useCase.run({ name: "My New Tag" });

		expect(result).toHaveProperty("id");
		expect(result.name).toBe("My New Tag");
		expect(result.slug).toBe("my-new-tag");
		expect(result.hidden).toBe(false);

		const stored = await repository.findById(result.id);
		expect(stored).not.toBeNull();
		expect(stored!.name).toBe("My New Tag");
	});

	it("should derive slug from the name automatically", async () => {
		const result = await useCase.run({ name: "Hello World" });

		expect(result.slug).toBe("hello-world");
	});

	it("should throw ResourceAlreadyExistsException if slug already exists", async () => {
		await useCase.run({ name: "Duplicate Tag" });

		await expect(useCase.run({ name: "Duplicate Tag" })).rejects.toThrow(
			ResourceAlreadyExistsException,
		);
	});

	it("should allow tags with different names that produce different slugs", async () => {
		const first = await useCase.run({ name: "Tag Alpha" });
		const second = await useCase.run({ name: "Tag Beta" });

		expect(first.slug).not.toBe(second.slug);
		expect(await repository.count()).toBe(2);
	});
});
