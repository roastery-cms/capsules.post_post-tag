import { TogglePostTagVisibilityUseCase } from "@/application/use-cases/toggle-post-tag-visibility.use-case";
import { makePostTagRepository } from "../repositories/post-tag.repository.factory";

export function makeTogglePostTagVisibilityUseCase(): TogglePostTagVisibilityUseCase {
	return new TogglePostTagVisibilityUseCase(makePostTagRepository());
}
