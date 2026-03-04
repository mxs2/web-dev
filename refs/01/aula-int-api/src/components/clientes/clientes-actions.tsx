import { Button, HStack } from "@chakra-ui/react";
import type { Cliente } from "@/types/cliente";

type ClientesActionsProps = {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onToggleStatus: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
};

export function ClientesActions({
  cliente,
  onEdit,
  onToggleStatus,
  onDelete,
}: ClientesActionsProps) {
  return (
    <HStack justify="flex-end">
      <Button size="sm" onClick={() => onEdit(cliente)}>
        Editar
      </Button>

      <Button size="sm" onClick={() => onToggleStatus(cliente)}>
        {cliente.ativo ? "Desativar" : "Ativar"}
      </Button>

      <Button size="sm" colorPalette="red" onClick={() => onDelete(cliente)}>
        Excluir
      </Button>
    </HStack>
  );
}