# my-zustand-app

Demo com Next.js (App Router) + TypeScript + Zustand + Chakra UI + Tailwind + API mock.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura
- `app/api/products/route.ts` — API mock (GET/PATCH)
- `store/products.ts` — Zustand store (persist, devtools, immer)
- `components/ProductCard.tsx` — UI (Chakra + Tailwind)
- `app/page.tsx` — Página principal
