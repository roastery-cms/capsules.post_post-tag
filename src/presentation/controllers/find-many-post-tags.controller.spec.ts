import { describe, it, beforeEach, expect } from "bun:test";
import { bootstrap } from "../dev/bootstrap";
import { faker } from "@faker-js/faker";
import { treaty } from "@elysiajs/eden";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("FindManyPostTagsController", () => {
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
		const name = faker.word.noun(5);
		const { data } = await api["post-tags"].post({ name }, options);
		return data!;
	}

	it("should return an empty list when no post tags exist", async () => {
		const { status, data } = await api["post-tags"].get({
			query: { page: 1 },
		});

		expect(status).toBe(200);
		expect(data).toBeArrayOfSize(0);
	});

	it("should return created post tags", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { status, data } = await api["post-tags"].get({
			query: { page: 1 },
		});

		expect(status).toBe(200);
		expect(data).toBeArrayOfSize(1);
		expect(data?.[0]?.name).toBe(created.name);
	});

	it("should return multiple post tags", async () => {
		const options = await authenticate();
		await createPostTag(options);
		await createPostTag(options);
		await createPostTag(options);

		const { status, data } = await api["post-tags"].get({
			query: { page: 1 },
		});

		expect(status).toBe(200);
		expect(data).toBeArrayOfSize(3);
	});

	it("should include pagination headers", async () => {
		const options = await authenticate();
		await createPostTag(options);

		const response = await api["post-tags"].get({ query: { page: 1 } });

		expect(response.status).toBe(200);
		expect(response.response.headers.get("X-Total-Count")).toBeDefined();
		expect(response.response.headers.get("X-Total-Pages")).toBeDefined();
	});

	it("should return correct total count header", async () => {
		const options = await authenticate();
		await createPostTag(options);
		await createPostTag(options);

		const response = await api["post-tags"].get({ query: { page: 1 } });

		expect(response.response.headers.get("X-Total-Count")).toBe("2");
	});

	it("should not require authentication", async () => {
		const { status } = await api["post-tags"].get({
			query: { page: 1 },
		});

		expect(status).toBe(200);
	});

	it("should return post tags with full payload", async () => {
		const options = await authenticate();
		const created = await createPostTag(options);

		const { data } = await api["post-tags"].get({ query: { page: 1 } });

		const tag = data?.[0];
		expect(tag?.id).toBeDefined();
		expect(tag?.name).toBe(created.name);
		expect(tag?.slug).toBeDefined();
		expect(tag?.hidden).toBe(false);
		expect(tag?.createdAt).toBeDefined();
	});
});
