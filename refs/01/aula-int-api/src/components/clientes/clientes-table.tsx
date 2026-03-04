import { Box, Flex, Spinner, Table, Tag, Text } from "@chakra-ui/react";
import type { Cliente } from "@/types/cliente";
import { ClientesActions } from "./clientes-actions";

type ClientesTableProps = {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onToggleStatus: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
};

export function ClientesTable({
  clientes,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: ClientesTableProps) {
  return (
    <Box borderWidth="1px" rounded="lg" p={6}>
      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner />
        </Flex>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Nome</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">
                Ações
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {clientes.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text color="gray.600">Nenhum cliente encontrado.</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              clientes.map((cliente) => (
                <Table.Row key={cliente.id}>
                  <Table.Cell>{cliente.id}</Table.Cell>
                  <Table.Cell>{cliente.nome}</Table.Cell>
                  <Table.Cell>{cliente.email}</Table.Cell>
                  <Table.Cell>
                    <Tag.Root colorPalette={cliente.ativo ? "green" : "red"}>
                      <Tag.Label>
                        {cliente.ativo ? "Ativo" : "Inativo"}
                      </Tag.Label>
                    </Tag.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <ClientesActions
                      cliente={cliente}
                      onEdit={onEdit}
                      onToggleStatus={onToggleStatus}
                      onDelete={onDelete}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}