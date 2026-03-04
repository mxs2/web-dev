"use client";

import { Container, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type { Cliente } from "@/types/cliente";
import type { ClienteFiltro } from "@/types/cliente-filtro";

import {
  createCliente,
  deleteClienteById,
  fetchClientes,
  updateCliente,
  updateClienteStatus,
} from "@/services/clientes-service";

import { ClientesFeedback } from "./clientes-feedback";
import { ClientesFilters } from "./clientes-filters";
import { ClientesForm } from "./clientes-form";
import { ClientesPageHeader } from "./clientes-page-header";
import { ClientesTable } from "./clientes-table";

export function ClientesContainer() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [filtro, setFiltro] = useState<ClienteFiltro>({
    q: "",
    ativo: "",
  });

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

      if (editingId === null) {
        await createCliente(payload);
        setMensagem("Cliente criado com sucesso.");
      } else {
        await updateCliente(editingId, payload);
        setMensagem("Cliente atualizado com sucesso.");
      }

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
      await updateClienteStatus(cliente.id, !cliente.ativo);
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
      await deleteClienteById(cliente.id);

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
        <ClientesPageHeader
          title="Cadastro de Clientes"
          description="Versão componentizada da página de clientes com Chakra UI."
        />

        <ClientesFeedback erro={erro} mensagem={mensagem} />

        <ClientesForm
          editingId={editingId}
          nome={nome}
          email={email}
          ativo={ativo}
          saving={saving}
          onNomeChange={setNome}
          onEmailChange={setEmail}
          onAtivoChange={setAtivo}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        <ClientesFilters filtro={filtro} onFiltroChange={setFiltro} />

        <ClientesTable
          clientes={clientes}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </Stack>
    </Container>
  );
}