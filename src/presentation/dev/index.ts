import { logger } from "@bogeychan/elysia-logger";
import Elysia from "elysia";
import { PostTagRoutes } from "..";
import openapi from "@elysiajs/openapi";
import { GetAccessController } from "@caffeine/auth/plugins/controllers";
import { CoreException } from "@caffeine/errors/core";
import { ExceptionLayer } from "@caffeine/errors/symbols";
import type { CaffeineExceptionRecords } from "@caffeine/errors/types";

const STATUS_CODE_MAP: CaffeineExceptionRecords<number> = {
	domain: {
		InvalidDomainDataException: 400,
		InvalidPropertyException: 400,
		OperationFailedException: 406,
	},
	application: {
		UnauthorizedException: 401,
		BadRequestException: 400,
		InvalidJWTException: 400,
		InvalidOperationException: 406,
		ResourceAlreadyExistsException: 409,
		ResourceNotFoundException: 404,
		UnableToSignPayloadException: 500,
	},
	infra: {
		ConflictException: 409,
		DatabaseUnavailableException: 503,
		ForeignDependencyConstraintException: 500,
		OperationNotAllowedException: 502,
		ResourceNotFoundException: 404,
		UnexpectedCacheValueException: 500,
	},
	internal: {
		InvalidEntityData: 500,
		InvalidObjectValueException: 500,
		UnknownException: 500,
	},
};

new Elysia()
	.on("error", ({ code, set, error: _error }) => {
		if (!(_error instanceof CoreException)) {
			const { message, name }: Error = _error;

			return { name, message, code };
		}

		const error: CoreException = _error;

		const layerMap = STATUS_CODE_MAP[error[ExceptionLayer]] as unknown as {
			[error.constructor.name]: number;
		};
		const status = layerMap ? layerMap[error.constructor.name] : 500;

		set.status = status ?? 500;

		const { message, name, source } = error;

		return { message, name, source };
	})
	.use(openapi({ path: "/docs", scalar: { showDeveloperTools: "never" } }))
	.use(logger({ autoLogging: true }))
	.use(GetAccessController)
	.use(PostTagRoutes)

	.listen(8080, () => {
		console.log(`🦊 server is running at: http://localhost:8080`);
	});
