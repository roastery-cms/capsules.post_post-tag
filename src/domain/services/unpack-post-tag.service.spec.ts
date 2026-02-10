import { describe, expect, it } from "vitest";
import { UnpactPostTag } from "./unpack-post-tag.service";
import { PostTag } from "../post-tag";

describe("UnpackPostTag Service", () => {
	it("should unpack a PostTag entity into a plain object", () => {
		const postTag = PostTag.make({
			name: "Test Tag",
			slug: "test-tag",
			hidden: false,
		});

		const unpacked = UnpactPostTag.run(postTag);

		expect(unpacked).toEqual({
			id: postTag.id,
			createdAt: postTag.createdAt,
			updatedAt: postTag.updatedAt,
			name: "Test Tag",
			slug: "test-tag",
			hidden: false,
		});
	});
});
