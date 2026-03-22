import type { IPostTagRepository } from "@/domain/types";

export interface IControllersWithoutAuth {
	repository: IPostTagRepository;
}
