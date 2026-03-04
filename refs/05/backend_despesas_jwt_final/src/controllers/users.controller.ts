import { Request, Response } from "express";
import { UsersService } from "../services/users.service";

export const UsersController = {
  async list(_req: Request, res: Response) {
    try {
      const users = await UsersService.list();
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar usuários" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const user = await UsersService.create({ name, email, password, role });
      return res.status(201).json(user);
    } catch (err: any) {
      console.error(err);
      if (err.code === "P2002") {
        return res.status(400).json({ message: "E-mail já cadastrado" });
      }
      if (err.message) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }
};
