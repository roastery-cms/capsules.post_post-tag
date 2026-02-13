import { describe, it, expect, beforeEach } from "vitest";
import { CreatePostTagUseCase } from "./create-post-tag.use-case";
import { PostTagRepository } from "@/infra/repositories/test/post-tag.repository";
import { SlugUniquenessCheckerService } from "@caffeine/domain/services";
import { ResourceAlreadyExistsException } from "@caffeine/errors/application";

describe("CreatePostTagUseCase", () => {
	let useCase: CreatePostTagUseCase;
	let repository: PostTagRepository;
	let uniquenessChecker: SlugUniquenessCheckerService<any, any>;

	beforeEach(() => {
		repository = new PostTagRepository();
		uniquenessChecker = new SlugUniquenessCheckerService(repository);
		useCase = new CreatePostTagUseCase(repository, uniquenessChecker);
	});

	it("should create a post tag successfully", async () => {
		const input = {
			name: "My New Tag",
		};

		const result = await useCase.run(input);

		expect(result).toHaveProperty("id");
		expect(result.name).toBe(input.name);
		expect(result.slug).toBe("my-new-tag");

		const stored = await repository.findById(result.id);
		expect(stored).toBeDefined();
		expect(stored?.name).toBe(input.name);
	});

	it("should throw ResourceAlreadyExistsException if slug already exists", async () => {
		const input = {
			name: "Existing Tag",
		};

		await useCase.run(input);

		await expect(useCase.run(input)).rejects.toThrow(
			ResourceAlreadyExistsException,
		);
	});
});
