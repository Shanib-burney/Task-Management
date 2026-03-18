import { Router } from "express";
import { validate } from "../common/functions.js";
import { createProjectSchema, updateProjectSchema } from "./project.validators.js";
import { ProjectController } from "./project.controller.js";
import { ProjectService } from "./project.service.js";
import { ProjectRepository } from "./project.repository.js";

const router = Router();
const projectController = new ProjectController(new ProjectService(new ProjectRepository()));

router.get("/", projectController.getAllProjects.bind(projectController));
router.get("/:id", projectController.getProjectById.bind(projectController));
router.post("/", validate(createProjectSchema), projectController.createProject.bind(projectController));
router.patch("/:id", validate(updateProjectSchema), projectController.updateProject.bind(projectController));
router.delete("/:id", projectController.deleteProject.bind(projectController));

export default router;
