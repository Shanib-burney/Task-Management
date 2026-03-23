import { Router } from "express";
import { createProjectSchema, updateProjectSchema } from "./project.validators";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "./project.repository";
import { validate } from "../shared/middlewares/validation.middleware";
import { idSchema } from "../shared/utils/utils";

const router = Router();
const projectController = new ProjectController(new ProjectService(new ProjectRepository()));


router.get("/", projectController.getAllProjects.bind(projectController));
router.get("/:id", validate({ params: idSchema }), projectController.getProjectById.bind(projectController));
router.post("/", validate({ body: createProjectSchema }), projectController.createProject.bind(projectController));
router.patch("/:id", validate({ params: idSchema, body: updateProjectSchema }), projectController.updateProject.bind(projectController));
router.delete("/:id", validate({ params: idSchema }), projectController.deleteProject.bind(projectController));

export default router;
