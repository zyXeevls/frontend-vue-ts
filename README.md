# Frontend Vue + TypeScript (Untuk Backend Rust)

Frontend ini dibuat dengan **Vue 3 + TypeScript + Vite** sebagai client untuk backend Rust yang sudah dibuat sebelumnya.
[Backend Api Jwt Rust](https://github.com/zyXeevls/backend-api-jwt-rust)

Status saat ini:
- Fondasi project sudah siap (Vite + Vue + TS).
- `axios` client sudah dibuat di `services/api.ts`.
- `@tanstack/vue-query` sudah terpasang dan diregistrasi di `src/main.ts`.
- UI masih bawaan starter (belum final feature app).

## Tujuan Project

Frontend ini dipakai untuk:
- Menampilkan data dari API backend Rust.
- Mengirim request CRUD (create/read/update/delete) ke backend.
- Menjadi antarmuka user untuk alur aplikasi fullstack Rust + Vue.

## Stack Teknologi

- `vue` `^3.5.25`
- `typescript` `~5.9.3`
- `vite` `^7.3.1`
- `axios` `^1.13.6`
- `@tanstack/vue-query` `^5.92.9`
- `js-cookie` `^3.0.5`
- `bootstrap` (via CDN di `index.html`)

## Struktur Folder

```txt
frontend-vue-ts/
|-- index.html
|-- package.json
|-- vite.config.ts
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
|-- services/
|   `-- api.ts
|-- public/
`-- src/
    |-- App.vue
    |-- main.ts
    |-- assets/
    `-- components/
        `-- HelloWorld.vue
```

## Penjelasan File Penting

### `services/api.ts`

Central HTTP client untuk request ke backend:

- Base URL: `http://localhost:3000/api`
- Header default: `Content-Type: application/json`

Semua pemanggilan API sebaiknya lewat instance ini agar konsisten.

### `src/main.ts`

Bootstrap aplikasi Vue:

- Membuat app dari `App.vue`
- Register `VueQueryPlugin`
- Mount ke `#app`

### `index.html`

- Menyediakan root mount `<div id="app"></div>`
- Memuat Bootstrap CSS/JS via CDN
- Menambahkan font `Quicksand` via Google Fonts

## Prasyarat

- Node.js `>= 20` (disarankan versi LTS terbaru)
- `pnpm` terinstal global

Contoh cek versi:

```bash
node -v
pnpm -v
```

## Instalasi

```bash
pnpm install
```

## Menjalankan Project

### Development mode

```bash
pnpm dev
```

Default Vite berjalan di:
- `http://localhost:5173`

### Build production

```bash
pnpm build
```

### Preview hasil build

```bash
pnpm preview
```

## Integrasi Dengan Backend Rust

Secara default frontend memanggil backend di:

`http://localhost:3000/api`

Pastikan:
- Service backend Rust sudah aktif di port `3000`.
- Endpoint tersedia dengan prefix `/api`.
- CORS backend mengizinkan origin frontend (umumnya `http://localhost:5173`).

## Alur Pengembangan API di Frontend

Disarankan pola berikut:

1. Buat module API per domain di `src` (misal `src/features/todos/api.ts`).
2. Gunakan `Api` dari `services/api.ts` untuk request `GET/POST/PUT/DELETE`.
3. Bungkus request dengan composable berbasis Vue Query (`useQuery`, `useMutation`).
4. Render data di komponen page/feature.

Contoh singkat service:

```ts
import Api from "../../services/api";

export async function getTodos() {
	const response = await Api.get("/todos");
	return response.data;
}
```

Contoh singkat query:

```ts
import { useQuery } from "@tanstack/vue-query";
import { getTodos } from "./api";

export function useTodosQuery() {
	return useQuery({
		queryKey: ["todos"],
		queryFn: getTodos,
	});
}
```

## Rekomendasi Struktur Lanjutan

Saat mulai tambah fitur real, struktur bisa dikembangkan menjadi:

```txt
src/
|-- app/
|-- features/
|   `-- <feature-name>/
|       |-- api.ts
|       |-- queries.ts
|       |-- mutations.ts
|       `-- components/
|-- shared/
|   |-- components/
|   |-- utils/
|   `-- types/
`-- router/
```

## Catatan Penting Saat Ini

- Dependency `vue-router` sudah terpasang, tapi routing belum diaktifkan di kode.
- Dependency `js-cookie` sudah terpasang, tapi belum dipakai untuk auth/session.
- `services/api.ts` masih hardcoded base URL. Untuk production, lebih aman pindah ke environment variable Vite (`import.meta.env`).

## Rencana Improvement yang Disarankan

1. Pindahkan base URL ke `.env` (`VITE_API_BASE_URL`).
2. Tambahkan folder fitur + typed API response/interface.
3. Implement global error handling (axios interceptor).
4. Tambahkan router dan layout halaman.
5. Tambahkan halaman real (list/create/update/delete) sesuai endpoint backend Rust.

## Troubleshooting

### `Network Error` saat request

Periksa:
- Backend Rust berjalan.
- Port backend benar (`3000`).
- Konfigurasi CORS backend.

### `404` endpoint tidak ditemukan

Periksa path endpoint di frontend apakah sudah sesuai dengan route backend (misal `/api/todos`).

### Build gagal karena TypeScript

Jalankan:

```bash
pnpm build
```

Lalu perbaiki error typing yang tampil di terminal.

## Lisensi

Ikuti lisensi utama repository project fullstack Rust + Vue ini.
