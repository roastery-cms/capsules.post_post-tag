import { describe, it, beforeEach, expect } from "bun:test";
import { bootstrap } from "../dev/bootstrap";
import { faker } from "@faker-js/faker";
import { treaty } from "@elysiajs/eden";
import { slugify } from "@roastery/beans/entity/helpers";

type App = Awaited<ReturnType<typeof bootstrap>>;

describe("CreatePostTagController", () => {
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

	it("should create a post tag", async () => {
		const options = await authenticate();
		const tagName = faker.word.noun();

		const { status, data } = await api["post-tags"].post(
			{ name: tagName },
			options,
		);

		expect(status).toBe(201);
		expect(data?.slug).toBe(slugify(tagName));
	});

	it("should return the full post tag payload on creation", async () => {
		const options = await authenticate();
		const tagName = faker.word.noun();

		const { data } = await api["post-tags"].post({ name: tagName }, options);

		expect(data).toMatchObject({
			name: tagName,
			slug: slugify(tagName),
			hidden: false,
		});
		expect(data?.id).toBeDefined();
		expect(data?.createdAt).toBeDefined();
		expect(data?.updatedAt).toBeUndefined();
	});

	it("should default hidden to false", async () => {
		const options = await authenticate();

		const { data } = await api["post-tags"].post(
			{ name: faker.word.noun() },
			options,
		);

		expect(data?.hidden).toBe(false);
	});

	it("should reject unauthenticated requests", async () => {
		const { status } = await api["post-tags"].post({
			name: faker.word.noun(),
		});

		expect(status).not.toBe(201);
	});

	it("should reject a request with missing name", async () => {
		const options = await authenticate();

		const { status } = await api["post-tags"].post(
			{ name: "" } as never,
			options,
		);

		expect(status).toBe(422);
	});

	it("should not allow duplicate post tags with the same slug", async () => {
		const options = await authenticate();
		const tagName = faker.word.noun();
		const body = { name: tagName };

		const first = await api["post-tags"].post(body, options);
		expect(first.status).toBe(201);

		const second = await api["post-tags"].post(body, options);
		expect(second.status).not.toBe(201);
	});

	it("should generate different slugs for different names", async () => {
		const options = await authenticate();

		const first = await api["post-tags"].post({ name: "Alpha Tag" }, options);

		const second = await api["post-tags"].post({ name: "Beta Tag" }, options);

		expect(first.status).toBe(201);
		expect(second.status).toBe(201);
		expect(first.data?.slug).not.toBe(second.data?.slug);
	});
});
