import { Request, Response } from "express";
import { DespesasService } from "../services/despesas.service";

export const DespesasController = {
  async list(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      const isAdmin = req.user.role === "admin";
      const userId = isAdmin ? undefined : req.user.id;
      const despesas = await DespesasService.list({ userId, isAdmin });
      return res.status(200).json(despesas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar despesas" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      const id = Number(req.params.id);
      const despesa = await DespesasService.getById(id);
      if (!despesa) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      const isAdmin = req.user.role === "admin";
      if (!isAdmin && despesa.userId !== req.user.id) {
        return res.status(403).json({ message: "Você não tem permissão para acessar esta despesa" });
      }
      return res.status(200).json(despesa);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar despesa" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      const { descricao, valor, data, categoria } = req.body;
      if (!descricao || valor === undefined) {
        return res.status(400).json({ message: "Descrição e valor são obrigatórios" });
      }
      const created = await DespesasService.create({
        descricao,
        valor: Number(valor),
        data: data ? new Date(data) : new Date(),
        categoria,
        userId: req.user.id
      });
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao criar despesa" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticicado" });
      }
      const id = Number(req.params.id);
      const existing = await DespesasService.getById(id);
      if (!existing) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      const isAdmin = req.user.role === "admin";
      if (!isAdmin && existing.userId !== req.user.id) {
        return res.status(403).json({ message: "Você não tem permissão para alterar esta despesa" });
      }
      const { descricao, valor, data, categoria } = req.body;
      const updated = await DespesasService.update(id, {
        descricao,
        valor: valor !== undefined ? Number(valor) : undefined,
        data: data ? new Date(data) : undefined,
        categoria
      });
      if (!updated) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao atualizar despesa" });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      const id = Number(req.params.id);
      const existing = await DespesasService.getById(id);
      if (!existing) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      const isAdmin = req.user.role === "admin";
      if (!isAdmin && existing.userId !== req.user.id) {
        return res.status(403).json({ message: "Você não tem permissão para remover esta despesa" });
      }
      const removed = await DespesasService.remove(id);
      if (!removed) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao remover despesa" });
    }
  }
};
