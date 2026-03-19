import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserBody } from "./user.validators";
import HTTP_STATUS_CODE from "../shared/utils/http-status-code";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async createUser(req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> {
    const { name, email, role, status, password } = req.body;
    try {
      await this.userService.createUser({
        name,
        email,
        role: Number(role),
        status,
        password,
      });
      res.status(201).json({ message: "User created successfully" });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Unique constraint failed")) {
        res.status(HTTP_STATUS_CODE.CONFLICT).json({ error: "Email already exists" });
        return;
      }
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const { name, email, role, status, password } = req.body;
    try {
      const user = await this.userService.updateUser(id, {
        name,
        email,
        role: role !== undefined ? Number(role) : undefined,
        status: status !== undefined ? Number(status) : undefined,
        passwordHash: password,
      });
      res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to update not found")) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    try {
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(500).json({ error: message });
    }
  }
}