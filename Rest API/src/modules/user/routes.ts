import { Router } from "express";
import { UserController } from "./controller.js";
import { UserService } from "./service.js";
import { UserRepository } from "./repository.js";
import { createUserSchema, updateUserSchema } from "./validators.js";

const router = Router();
const userController = new UserController(new UserService(new UserRepository()));

const validate = (schema: any) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.errors });
  }
  req.body = result.data;
  next();
};

router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.post("/", validate(createUserSchema), userController.createUser.bind(userController));
router.put("/:id", validate(updateUserSchema), userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
