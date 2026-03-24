import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDTO, UpdateUserDTO } from "./user.validators";
import { NotFoundException } from "../shared/utils/exceptions";
import { logger } from "../shared/utils/logger";
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

    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }
      const user = await this.userService.getUserById(id);

      if (!user) {
        logger.info(`User with ID ${id} not found`, { requestId: req.requestId });
        throw new NotFoundException("User id not found");
      }
      res.json(user)
    } catch (error) {
      throw error;
    }


  }

  async createUser(req: Request<{}, {}, CreateUserDTO>, res: Response, next: Function): Promise<void> {
    try {
      await this.userService.createUser(req.body);
      res.status(HTTP_STATUS_CODE.CREATED).json({ message: "User created successfully" });

    } catch (error) {
      next(error);
    }

  }

  async patchUser(req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response): Promise<void> {
    const id = Number(req.params.id);
    try {
      await this.userService.updateUser(id, req.body);
      res.json({message: "User updated successfully"});
    } catch (error: unknown) {
      throw error
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