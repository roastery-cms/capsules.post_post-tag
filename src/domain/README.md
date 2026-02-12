# PostTag Domain (`post@post-tag`)

This module encapsulates the business logic for managing **Post Tags**. It is designed following Domain-Driven Design (DDD) and Clean Architecture principles, ensuring total isolation from infrastructure and persistence details.

## 1. Overview

The domain revolves around the `PostTag` entity, which represents a classificatory tag for platform content. The design prioritizes a **rich domain model** over anemic models, centralizing business rules and validations within the entity itself.

### Key Features
- **Self-Identity**: Managed via UUID (inherited from `Entity`).
- **Immutability by Default**: Properties are exposed as *readonly* and changed only via explicit business methods.
- **Strong Validation**: Use of Value Objects (`DefinedStringVO`, `SlugVO`) to ensure data integrity from instantiation.
- **Automatic Auditing**: Tracking of creation and update dates (`createdAt`, `updatedAt`).

## 2. Entities

### `PostTag`

The aggregate root entity.

**Responsibilities:**
- Maintain the internal consistent state of a tag.
- Provide mutation methods that express business intent (`rename`, `reslug`, `toggleVisibility`).

**Read Properties:**
- `name`: Display name of the tag (e.g., "Technology").
- `slug`: Friendly unique identifier for URLs (e.g., "technology").
- `hidden`: Defines if the tag is publicly visible or archived (soft-delete).

**Business Methods:**

| Method | Description | Behavior |
| :--- | :--- | :--- |
| `rename(value: string)` | Changes the display name. | **Does not change the slug**. This preserves existing URLs even after renaming. Updates `updatedAt`. |
| `reslug(value: string)` | Changes the tag's slug. | Allows explicit correction or redirection of URLs. Updates `updatedAt`. |
| `toggleVisibility()` | Toggles the `hidden` state. | Implements logic for archiving/soft-delete without physical removal. Updates `updatedAt`. |

**Factory:**
Creation of new instances must be done exclusively through the static `PostTag.make(...)` method.

```typescript
const tag = PostTag.make({
  name: "New Tag",
  slug: "new-tag", // Optional (fallback to name if omitted)
  hidden: false    // Optional (default: false)
});
```

## 3. Domain Services

### `PostTagUniquenessChecker`
Service responsible for validating the uniqueness of a slug in the system.
- **Usage**: Must be invoked before creating or changing a slug to ensure no collisions.
- **Dependency**: Injects `IPostTagRepository` for querying, keeping the service agnostic to persistence.

### `UnpackPostTag`
Utility service (Mapper) that converts the rich `PostTag` entity into a flat data structure (`DTO`) safe for transport between layers (e.g., API, UI).
- **Goal**: Prevent leakage of business rules and entity methods to external layers.

## 4. Contracts (Interfaces)

### `IPostTagRepository`
Defines the persistence operations required for the domain, without coupling to specific technologies (SQL, NoSQL).

- `findById(id: string): Promise<PostTag | null>`
- `findBySlug(slug: string): Promise<PostTag | null>`
- `create(postTag: PostTag): Promise<void>`
- `update(postTag: PostTag): Promise<void>`

> **Note on Deletion**: The interface does not strictly provide a `delete` method. Logical removal is handled by the `hidden` property of the entity, aligned with the data historical preservation strategy.
