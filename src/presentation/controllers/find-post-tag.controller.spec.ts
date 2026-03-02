import { describe, it, beforeEach, expect } from "bun:test";
import { bootstrap } from "../dev/bootstrap";
import { faker } from "@faker-js/faker";
import { treaty } from "@elysiajs/eden";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("FindPostTagController", () => {
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

	it("should find a post tag by slug", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status, data } = await postTag(created.slug).get();

		expect(status).toBe(200);
		expect(data?.slug).toBe(created.slug);
		expect(data?.name).toBe(created.name);
	});

	it("should find a post tag by id", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status, data } = await postTag(created.id).get();

		expect(status).toBe(200);
		expect(data?.id).toBe(created.id);
	});

	it("should return the full post tag payload", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { data } = await postTag(created.slug).get();

		expect(data).toMatchObject({
			name: created.name,
			slug: created.slug,
			hidden: false,
		});
		expect(data?.id).toBeDefined();
		expect(data?.createdAt).toBeDefined();
	});

	it("should not require authentication", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status } = await postTag(created.slug).get();
		expect(status).toBe(200);
	});

	it("should return an error for a non-existent slug", async () => {
		const { status } = await postTag("non-existent-slug").get();

		expect(status).not.toBe(200);
	});

	it("should return an error for a non-existent id", async () => {
		const { status } = await postTag(
			"550e8400-e29b-41d4-a716-446655440000",
		).get();

		expect(status).not.toBe(200);
	});
});
