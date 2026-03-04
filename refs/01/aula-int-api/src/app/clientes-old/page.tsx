"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  createListCollection,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Switch,
  Table,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import type { Cliente } from "@/types/cliente";

type Filtro = {
  q: string;
  ativo: "" | "true" | "false";
};

async function fetchClientes(params: { q?: string; ativo?: "true" | "false" } = {}) {
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.ativo) sp.set("ativo", params.ativo);

  const queryString = sp.toString();
  const url = queryString ? `/api/clientes?${queryString}` : "/api/clientes";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("Falha ao carregar clientes");

  const json = await res.json();
  return json.data as Cliente[];
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [filtro, setFiltro] = useState<Filtro>({
    q: "",
    ativo: "",
  });

  const [saving, setSaving] = useState(false);

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

  async function carregarClientes() {
    try {
      setLoading(true);
      setErro("");

      const data = await fetchClientes({
        q: filtro.q || undefined,
        ativo: filtro.ativo || undefined,
      });

      setClientes(data);
    } catch {
      setErro("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, [filtro.q, filtro.ativo]);

  function resetForm() {
    setNome("");
    setEmail("");
    setAtivo(true);
    setEditingId(null);
  }

  function handleEdit(cliente: Cliente) {
    setNome(cliente.nome);
    setEmail(cliente.email);
    setAtivo(cliente.ativo);
    setEditingId(cliente.id);
    setMensagem("");
    setErro("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErro("");
    setMensagem("");

    try {
      const payload = { nome, email, ativo };

      let res: Response;

      if (editingId === null) {
        res = await fetch("/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/clientes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Falha ao salvar cliente");
      }

      setMensagem(
        editingId === null
          ? "Cliente criado com sucesso."
          : "Cliente atualizado com sucesso."
      );

      resetForm();
      await carregarClientes();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(cliente: Cliente) {
    setErro("");
    setMensagem("");

    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !cliente.ativo }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Falha ao atualizar status");
      }

      setMensagem(`Status de "${cliente.nome}" atualizado com sucesso.`);
      await carregarClientes();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao atualizar status."
      );
    }
  }

  async function handleDelete(cliente: Cliente) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o cliente "${cliente.nome}"?`
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Falha ao excluir cliente");
      }

      setMensagem(`Cliente "${cliente.nome}" excluído com sucesso.`);

      if (editingId === cliente.id) {
        resetForm();
      }

      await carregarClientes();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao excluir cliente."
      );
    }
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack gap={8}>
        <Box>
          <Heading size="lg">Cadastro de Clientes</Heading>
          <Text mt={2} color="gray.600">
            Exemplo com Chakra UI consumindo API
          </Text>
        </Box>

        {erro && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Erro</Alert.Title>
              <Alert.Description>{erro}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {mensagem && (
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Sucesso</Alert.Title>
              <Alert.Description>{mensagem}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Heading size="md" mb={4}>
            {editingId === null ? "Novo Cliente" : `Editando #${editingId}`}
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Switch.Root
                checked={ativo}
                onCheckedChange={(details) => setAtivo(!!details.checked)}
              >
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label>Ativo</Switch.Label>
              </Switch.Root>

              <HStack>
                <Button type="submit" loading={saving}>
                  {editingId === null ? "Cadastrar" : "Salvar"}
                </Button>

                <Button type="button" variant="outline" onClick={resetForm}>
                  Limpar
                </Button>
              </HStack>
            </Stack>
          </form>
        </Box>

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Stack gap={4} direction={{ base: "column", md: "row" }}>
            <Input
              placeholder="Buscar..."
              value={filtro.q}
              onChange={(e) =>
                setFiltro((prev) => ({ ...prev, q: e.target.value }))
              }
            />

            <Box minW={{ base: "100%", md: "220px" }}>
              <Select.Root
                collection={statusCollection}
                value={[filtro.ativo]}
                onValueChange={(details) =>
                  setFiltro((prev) => ({
                    ...prev,
                    ativo: (details.value[0] as "" | "true" | "false") || "",
                  }))
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
                {clientes.map((c) => (
                  <Table.Row key={c.id}>
                    <Table.Cell>{c.id}</Table.Cell>
                    <Table.Cell>{c.nome}</Table.Cell>
                    <Table.Cell>{c.email}</Table.Cell>
                    <Table.Cell>
                      <Tag.Root colorPalette={c.ativo ? "green" : "red"}>
                        <Tag.Label>{c.ativo ? "Ativo" : "Inativo"}</Tag.Label>
                      </Tag.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack justify="flex-end">
                        <Button size="sm" onClick={() => handleEdit(c)}>
                          Editar
                        </Button>
                        <Button size="sm" onClick={() => handleToggleStatus(c)}>
                          {c.ativo ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          size="sm"
                          colorPalette="red"
                          onClick={() => handleDelete(c)}
                        >
                          Excluir
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      </Stack>
    </Container>
  );
}