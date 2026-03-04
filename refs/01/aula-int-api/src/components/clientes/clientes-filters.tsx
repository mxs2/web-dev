import {
  Box,
  createListCollection,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import type { ClienteFiltro } from "@/types/cliente-filtro";

type ClientesFiltersProps = {
  filtro: ClienteFiltro;
  onFiltroChange: (filtro: ClienteFiltro) => void;
};

export function ClientesFilters({
  filtro,
  onFiltroChange,
}: ClientesFiltersProps) {
  const statusCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Todos", value: "" },
          { label: "Ativos", value: "true" },
          { label: "Inativos", value: "false" },
        ],
      }),
    []
  );

  return (
    <Box borderWidth="1px" rounded="lg" p={6}>
      <Stack gap={4} direction={{ base: "column", md: "row" }}>
        <Input
          placeholder="Buscar..."
          value={filtro.q}
          onChange={(e) =>
            onFiltroChange({
              ...filtro,
              q: e.target.value,
            })
          }
        />

        <Box minW={{ base: "100%", md: "220px" }}>
          <Select.Root
            collection={statusCollection}
            value={[filtro.ativo]}
            onValueChange={(details) =>
              onFiltroChange({
                ...filtro,
                ativo: (details.value[0] as "" | "true" | "false") || "",
              })
            }
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Todos" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
              <Select.Content>
                {statusCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
      </Stack>
    </Box>
  );
}