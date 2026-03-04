import { Request, Response } from "express";
import { DespesasService } from "../services/despesas.service";

export const DespesasController = {
  async list(req: Request, res: Response) {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const despesas = await DespesasService.list({ userId });
      return res.status(200).json(despesas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar despesas" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const despesa = await DespesasService.getById(id);
      if (!despesa) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }
      return res.status(200).json(despesa);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar despesa" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { descricao, valor, data, categoria, userId } = req.body;
      const created = await DespesasService.create({
        descricao,
        valor: Number(valor),
        data: data ? new Date(data) : new Date(),
        categoria,
        userId: Number(userId)
      });
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao criar despesa" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
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
      const id = Number(req.params.id);
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
