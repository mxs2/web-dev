import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Product = { id: string; name: string; price: number; favorite: boolean };

type ProductsState = {
  items: Product[];
  loading: boolean;
  error?: string;
  fetchAll: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  reset: () => void;
};

export const useProductsStore = create<ProductsState>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        loading: false,
        error: undefined,

        fetchAll: async () => {
          set((s) => { s.loading = true; s.error = undefined; });
          try {
            const res = await fetch("/api/products", { cache: "no-store" });
            const data: Product[] = await res.json();
            set((s) => { s.items = data; });
          } catch (e) {
            set((s) => { s.error = "Falha ao carregar produtos"; });
          } finally {
            set((s) => { s.loading = false; });
          }
        },

        toggleFavorite: async (id: string) => {
          const prev = get().items;
          set((s) => {
            const p = s.items.find((x) => x.id === id);
            if (p) p.favorite = !p.favorite;
          });

          try {
            const updated = get().items.find((x) => x.id === id);
            await fetch("/api/products", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, favorite: !!updated?.favorite }),
            });
          } catch {
            set((s) => { s.items = prev; });
          }
        },

        reset: () => set(() => ({ items: [], loading: false, error: undefined })),
      })),
      { name: "products-store" }
    )
  )
);
