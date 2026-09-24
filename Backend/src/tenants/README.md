# 🏢 Tenants Module

Manages **multi-tenancy** for the platform. A `Tenant` is a restaurant brand / group that can own multiple `Restaurants`, each with multiple `Branches`.

## Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/tenants` | Create tenant + assign owner | Admin |
| GET | `/tenants` | List all tenants | Admin |
| GET | `/tenants/:id` | Get tenant by ID | Admin / Owner |
| PATCH | `/tenants/:id` | Update tenant info | Admin / Owner |
| PATCH | `/tenants/:id/settings` | Update tenant settings | Admin / Owner |
| DELETE | `/tenants/:id` | Soft-delete tenant | Admin |

## Files

```
tenants/
├── tenants.module.ts
├── tenants.controller.ts
├── tenants.service.ts       # createTenant(), updateSettings(), etc.
├── tenant.types.ts          # TenantStatus, TenantPlan enums
├── constants/
├── events/                  # TenantCreatedEvent, TenantSuspendedEvent
├── interfaces/
└── schemas/
    ├── tenant.schema.ts             # Tenant + TenantSettings sub-doc
    └── tenant-settings.schema.ts
```

## Schema Fields — Tenant

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Brand name |
| `slug` | String | Unique URL slug |
| `ownerId` | ObjectId | Ref to User |
| `status` | TenantStatus | ACTIVE, SUSPENDED, TRIAL |
| `plan` | TenantPlan | FREE, STARTER, PRO, ENTERPRISE |
| `settings` | TenantSettings | Sub-document |

## Tenant → Restaurant → Branch Relationship

```
Tenant (brand)
  └── Restaurant (location group)
        └── Branch (physical location)
```

## On Create
1. Tenant document created
2. Owner `User` role → `OWNER`, `tenantId` → new tenant ID (via `UsersService`)
3. `TenantCreatedEvent` emitted for downstream listeners
