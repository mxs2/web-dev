"use client";

import { FC } from "react";
import { Card, CardBody, Heading, Text, Button, Badge, HStack } from "@chakra-ui/react";
import { Product, useProductsStore } from "@/store/products";
import { FaStar } from "react-icons/fa";

type Props = { product: Product };

export const ProductCard: FC<Props> = ({ product }) => {
  const toggleFavorite = useProductsStore((s) => s.toggleFavorite);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardBody className="grid gap-3">
        <Heading size="md" className="flex items-center gap-2">
          {product.name}
          {product.favorite && <Badge colorScheme="yellow">Favorito</Badge>}
        </Heading>
        <Text className="text-neutral-600">R$ {product.price.toFixed(2)}</Text>
        <HStack>
          <Button
            leftIcon={<FaStar />}
            variant={product.favorite ? "solid" : "outline"}
            colorScheme="yellow"
            onClick={() => toggleFavorite(product.id)}
          >
            {product.favorite ? "Desfavoritar" : "Favoritar"}
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};
