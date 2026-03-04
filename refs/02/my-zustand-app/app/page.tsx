"use client";

import { FC, useEffect } from "react";
import { useProductsStore } from "@/store/products";
import { SimpleGrid, Heading, Spinner, Alert, AlertIcon, Button, HStack } from "@chakra-ui/react";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const HomePage: FC = () => {
  const { items, loading, error, fetchAll, reset } = useProductsStore();

  useEffect(() => {
    if (items.length === 0) fetchAll();
  }, [fetchAll, items.length]);

  return (
    <main className="p-6 max-w-6xl mx-auto grid gap-6">
      <div className="flex items-center justify-between">
        <Heading size="lg">Catálogo</Heading>
        <HStack>
          <Button onClick={fetchAll} isDisabled={loading}>Recarregar</Button>
          <Button variant="outline" onClick={reset}>Reset</Button>
        </HStack>
      </div>

      {loading && (
        <div className="flex items-center gap-2">
          <Spinner /> Carregando…
        </div>
      )}

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </SimpleGrid>
    </main>
  );
};

export default HomePage;
