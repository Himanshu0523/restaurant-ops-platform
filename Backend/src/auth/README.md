# 🔐 Auth Module

Handles all **authentication** for the Servio platform. User identity/profile state lives in `UserModule`.

## Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login, receive tokens | Public |
| POST | `/auth/refresh` | Rotate access token | Public (refresh token) |
| POST | `/auth/logout` | Clear refresh token | JWT |
| POST | `/auth/forgot-password` | Send reset email | Public |
| POST | `/auth/reset-password` | Reset password via OTP | Public |

## Files

```
auth/
├── auth.module.ts           # Module definition
├── auth.controller.ts       # Route handlers
├── auth.service.ts          # Business logic (token gen, bcrypt, hashing)
├── auth.guard.ts            # JwtAuthGuard — global default guard
├── mail.service.ts          # Sends OTP / reset emails
├── constants.ts             # JWT_SECRET key constant
├── decorators/              # @Public() to bypass guard
├── guards/                  # Additional guards
├── schemas/                 # OTP / refresh token schemas
└── dto/
    ├── registerUser.dto.ts
    ├── loginUser.dto.ts
    ├── refreshToken.dto.ts
    ├── forgotPassword.dto.ts
    └── resetPassword.dto.ts
```

## Token Strategy

- **Access Token**: Short-lived JWT (15m default), signed with `JWT_SECRET`
- **Refresh Token**: Long-lived (7d), hash stored on `User.refreshTokenHash`
- On refresh: old hash verified → new token pair issued → hash rotated
- On logout: `refreshTokenHash` set to `null`

## Dependencies

- `UserModule` — to create/find users
- `ConfigModule` — for JWT secrets
- `MailService` — for OTP delivery
