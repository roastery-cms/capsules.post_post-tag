import { describe, it, beforeEach, expect } from "bun:test";
import { bootstrap } from "../dev/bootstrap";
import { faker } from "@faker-js/faker";
import { treaty } from "@elysiajs/eden";
import { slugify } from "@caffeine/entity/helpers";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("UpdatePostTagController", () => {
	let server: App;
	let api: ReturnType<typeof treaty<App>>;
	let env: App["decorator"]["env"];

	beforeEach(async () => {
		server = await bootstrap();
		await (
			server.decorator.cache as unknown as {
				flushall: () => Promise<void>;
			}
		).flushall();
		api = treaty<typeof server>(server);
		env = server.decorator.env;
	});

	async function authenticate() {
		const { AUTH_EMAIL: email, AUTH_PASSWORD: password } = env;
		const auth = await api.auth.login.post({ email, password });
		const cookies = auth.response.headers.getSetCookie();
		return { headers: { cookie: cookies.join("; ") } };
	}

	async function createPostTag(
		options: Awaited<ReturnType<typeof authenticate>>,
	) {
		const name = faker.word.noun();
		const { data } = await api["post-tags"].post({ name }, options);
		return data!;
	}

	function postTag(idOrSlug: string) {
		return api["post-tags"]({ "id-or-slug": idOrSlug });
	}

	it("should update the name of a post tag", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);
		const newName = faker.word.noun();

		const { status, data } = await postTag(created.id).patch(
			{ name: newName },
			options,
		);

		expect(status).toBe(200);
		expect(data?.name).toBe(newName);
	});

	it("should not update the slug when renaming without update-slug", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { data } = await postTag(created.id).patch(
			{ name: faker.word.noun() },
			options,
		);

		expect(data?.slug).toBe(created.slug);
	});

	it("should update the slug when renaming with update-slug=true", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);
		const newName = faker.word.noun();

		const { status, data } = await postTag(created.id).patch(
			{ name: newName },
			{ ...options, query: { "update-slug": true } },
		);

		expect(status).toBe(200);
		expect(data?.slug).toBe(slugify(newName));
	});

	it("should update the slug explicitly", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);
		const newSlug = "custom-slug";

		const { status, data } = await postTag(created.id).patch(
			{ slug: newSlug },
			options,
		);

		expect(status).toBe(200);
		expect(data?.slug).toBe(newSlug);
	});

	it("should update the hidden status", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		expect(created.hidden).toBe(false);

		const { status, data } = await postTag(created.id).patch(
			{ hidden: true },
			options,
		);

		expect(status).toBe(200);
		expect(data?.hidden).toBe(true);
	});

	it("should set updatedAt after update", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		expect(created.updatedAt).toBeUndefined();

		const { data } = await postTag(created.id).patch(
			{ name: faker.word.noun() },
			options,
		);

		expect(data?.updatedAt).toBeDefined();
	});

	it("should find by slug and update", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);
		const newName = faker.word.noun();

		const { status, data } = await postTag(created.slug).patch(
			{ name: newName },
			options,
		);

		expect(status).toBe(200);
		expect(data?.name).toBe(newName);
		expect(data?.id).toBe(created.id);
	});

	it("should reject unauthenticated requests", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status } = await postTag(created.id).patch({
			name: faker.word.noun(),
		});

		expect(status).not.toBe(200);
	});

	it("should reject a request with empty body", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status } = await postTag(created.id).patch(
			{} as never,
			options,
		);

		expect(status).toBe(422);
	});

	it("should reject slug update that conflicts with existing tag", async () => {
		const options = await authenticate();
		const tagA = await createPostTag(options);
		const tagB = await createPostTag(options);

		const { status } = await postTag(tagB.id).patch(
			{ slug: tagA.slug },
			options,
		);

		expect(status).not.toBe(200);
	});

	it("should not update a non-existent post tag", async () => {
		const options = await authenticate();

		const { status } = await postTag(
			"550e8400-e29b-41d4-a716-446655440000",
		).patch({ name: faker.word.noun() }, options);

		expect(status).not.toBe(200);
	});
});
