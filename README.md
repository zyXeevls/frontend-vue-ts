# Frontend Vue + TypeScript 

Frontend ini dibuat dengan **Vue 3 + TypeScript + Vite** sebagai client untuk backend Rust JWT.

Referensi backend:
[Backend Api Jwt Rust](https://github.com/zyXeevls/backend-api-jwt-rust)

## Status Sementara

- Routing sudah aktif (`vue-router`) untuk halaman `home`, `register`, `login`.
- Auth form register/login sudah terhubung ke API via `@tanstack/vue-query` mutation.
- HTTP client terpusat di `services/api.ts`.
- Header `Authorization: Bearer <token>` dikirim otomatis lewat axios interceptor jika cookie `token` ada.
- Alias import `@/*` sudah aktif di Vite + TypeScript.

## Stack

- `vue`
- `typescript`
- `vite`
- `vue-router`
- `@tanstack/vue-query`
- `axios`
- `js-cookie`
- `bootstrap` (CDN)

## Struktur Folder (Ringkas)

```txt
frontend-vue-ts/
|-- services/
|   `-- api.ts
`-- src/
	|-- composables/
	|   `-- auth/
	|       |-- useAuthUser.ts
	|       |-- useLogin.ts
	|       |-- useLogout.ts
	|       `-- useRegister.ts
	|-- routes/
	|   `-- index.ts
	`-- views/
		|-- auth/
		|   |-- login.vue
		|   `-- register.vue
		`-- home/
			`-- index.vue
```

## Konfigurasi Penting

### Base URL API

`services/api.ts` memakai:

- `import.meta.env.VITE_API_BASE_URL`, atau fallback ke
- `http://localhost:3000/api`

Contoh `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Alias Path

- Vite: `vite.config.ts` -> `resolve.alias` (`@` ke `./src`)
- TypeScript: `tsconfig.app.json` -> `baseUrl` + `paths`

Contoh import:

```ts
import { useLogin } from "@/composables/auth/useLogin";
```

## Alur Auth Saat Ini

1. Register kirim `POST /register`.
2. Login kirim `POST /login`.
3. Saat login sukses, token/user disimpan ke cookie (`token`, `user`).
4. Request berikutnya otomatis membawa bearer token dari cookie.
5. Logout menghapus cookie auth.

## Menjalankan Project

```bash
pnpm install
pnpm dev
```

Build production:

```bash
pnpm build
pnpm preview
```

## Known Issue (Sementara)

- Di `src/views/auth/login.vue`, redirect sukses login saat ini ke `/admin/dashboard`.
- Route `/admin/dashboard` belum terdaftar di `src/routes/index.ts`.
- Jika setelah login pindah ke halaman kosong/404, ubah redirect ke route yang sudah ada (misal `/`) atau tambahkan route dashboard.

## Troubleshooting Cepat

### Missing or invalid token

- Pastikan login response memang mengembalikan token.
- Cek cookie `token` tersimpan setelah login.
- Cek endpoint protected menerima header `Authorization: Bearer <token>`.

### Network error / CORS

- Pastikan backend Rust aktif di `localhost:3000`.
- Cek CORS backend mengizinkan origin frontend (`http://localhost:5173`).

### 404 endpoint

- Pastikan endpoint frontend match dengan backend dan prefix `/api`.
