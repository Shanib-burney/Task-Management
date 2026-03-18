import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { createUserSchema, updateUserSchema } from "./user.validators";
import { validate } from "../common/functions";

const router = Router();
const userController = new UserController(new UserService(new UserRepository()));


router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.post("/", validate(createUserSchema), userController.createUser.bind(userController));
router.put("/:id", validate(updateUserSchema), userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
