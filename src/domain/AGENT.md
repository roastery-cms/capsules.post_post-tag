# Agent Context: PostTag Domain (`post@post-tag`)

This file contains critical context, strict rules, and patterns for any AI agent working on the `post@post-tag` domain. Read this before proposing changes.

## 1. Core Principles & Boundaries

- **Pure TypeScript Domain**: This layer MUST NOT depend on any framework (React, NestJS, Express) or infrastructure libraries (axios, pg, mongoose).
- **Zero External Dependencies**: Use only internal packages (`@caffeine/*`) or standard node modules.
- **Strict Typing**: `any` is strictly FORBIDDEN. Use `unknown` with narrowing or rigorous mapped types.
- **Soft Delete Only**: Data is never physically deleted. The `hidden` property controls visibility. Do not implement `delete()` methods in repositories unless explicitly instructed for GDPR compliance.

## 2. Architecture: Caffeine Entity Pattern

The domain follows a strict Entity pattern from `@caffeine/entity`.

### Entity Structure
- **Inheritance**: All entities must extend `Entity`.
- **Constructor**: Must be `private`. Use a static `make()` factory method.
- **Props**: Use `EntityDTO` for internal state and `IMake{EntityName}` for the public factory interface.
- **Preparation**: The `make()` method MUST call `Entity.prepare(entityProps)` before returning `new Entity(...)`.
- **Validation**: Use `Value Objects` (e.g., `DefinedStringVO`) inside the constructor. Do not rely on primitive checks.
- **Getters**: Expose properties as primitives (e.g., `string`, `boolean`), unwrapping Value Objects internally.

### Example Pattern
```typescript
import { Entity } from "@caffeine/entity";
import { makeEntityFactory } from "@caffeine/entity/factories";

export class PostTag extends Entity implements IPostTag {
  // ... private props ...

  private constructor(props: IMakePostTag, entityProps: EntityDTO) {
    super(entityProps);
    // ... validation logic ...
  }

  public static make(initialProps: IMakePostTag, _entityProps?: EntityDTO): PostTag {
    const entityProps = _entityProps ?? makeEntityFactory();
    Entity.prepare(entityProps); // CRITICAL: Initializes ID, CreatedAt, UpdatedAt
    return new PostTag(initialProps, entityProps);
  }
}
```

## 3. Public API & Interfaces

### Entity Mutation
State changes must happen via semantic methods, decorated with `@AutoUpdate` to handle `updatedAt`.
- `rename(name: string): void` -> Updates name, DOES NOT change slug.
- `reslug(slug: string): void` -> Explicitly updates slug.
- `toggleVisibility(): void` -> Toggles `hidden`.

### Repository Contract (`IPostTagRepository`)
Agents implementation of repositories must adhere to:
- `create(data: IPostTag): Promise<void>`
- `update(data: IPostTag): Promise<void>`
- `findById(id: string): Promise<IPostTag | null>`
- `findBySlug(slug: string): Promise<IPostTag | null>`
- `findMany(page: number): Promise<IPostTag[]>`
- `findManyByIds(ids: string[]): Promise<Array<IPostTag | null>>`
- `count(): Promise<number>`

## 4. Testing Guidelines

- **Framework**: Use `vitest` exclusively.
- **No Repository Mocks**: Do NOT mock repository interfaces with `vi.fn()`. Use in-memory implementations from `src/infra/repositories/test` (if available) or create a fake implementation.
- **Entity Factories**: When testing, use `makeEntityFactory` or the entity's static `.make()` method.
- **Assertions**: Verify state changes through public getters.

## 5. File Structure Convention

```
src/domain/
├── services/               # Domain services (e.g., UniquenessChecker)
├── types/                  # All interfaces (Entity, Repository, DTOs)
│   ├── index.ts            # Central export
│   └── *.interface.ts
├── post-tag.ts             # Main Aggregate Root
└── post-tag.spec.ts        # Domain Unit Tests
```

## 6. Common Pitfalls to Avoid
- **Renaming changes slug**: In this domain, `rename()` MUST NOT update the slug automatically. This is a deliberate URL preservation feature.
- **Missing `Entity.prepare`**: Forgetting this in the static factory causes IDs and dates to be undefined.
- **Public Setters**: Never create public setters. Use specific methods like `rename()`, `activate()`.
- **Magic Strings**: Use the `entitySource` property correctly (e.g. "post@post-tag").
