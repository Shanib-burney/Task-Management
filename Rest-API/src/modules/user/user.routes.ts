import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { createUserSchema, updateUserSchema } from "./user.validators";
import { validate } from "../shared/middlewares/validation.middleware";
import { idSchema } from "../shared/utils/types";

const router = Router();
const userController = new UserController(new UserService(new UserRepository()));


router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", validate({ params: idSchema }), userController.getUserById.bind(userController));
router.post("/", validate({ body: createUserSchema }), userController.createUser.bind(userController));
router.put("/:id", validate({ params: idSchema, body: updateUserSchema }), userController.updateUser.bind(userController));
router.delete("/:id", validate({ params: idSchema }), userController.deleteUser.bind(userController));

export default router;
