# Server

## On WSL2 w/ Ubuntu 20.04

- There's an OpenSSL error with the WSL and Ubuntu.
- Need to revert to Node version, around Node 16.

```
dotenv -e .envrc -- npx prisma db pull
```

```
dotenv -e .envrc -- npx prisma migrate resolve --applied 0_init --schema=apps/server/prisma/schema.prisma
```

`dotenv -e .envrc -- npx prisma migrate`

```
dotenv -e .envrc -- npx prisma generate --schema=apps/server/prisma/schema.prisma
```

`dotenv -e .envrc -- nodemon mapps/server/src/main.ts`

```
dotenv -e .envrc -- prisma migrate dev --schema=apps/server/prisma/schema.prisma
```
