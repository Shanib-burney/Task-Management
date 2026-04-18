import { Router } from 'express';
import { createProjectSchema, createTasksSchema, updateProjectSchema } from './project.validators';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { validate } from '../shared/middlewares/validation.middleware';
import { idSchema, pagingSchema } from '../shared/utils/utils';
import { UserRepository } from '../user/user.repository';

const router = Router();
const projectController = new ProjectController(
  new ProjectService(new ProjectRepository(), new UserRepository()),
);

router.get(
  '/',
  validate({ query: pagingSchema }),
  projectController.getAllProjects.bind(projectController),
);
router.get(
  '/:id',
  validate({ params: idSchema }),
  projectController.getProjectById.bind(projectController),
);
router.post(
  '/:id/tasks',
  validate({ body: createTasksSchema, params: idSchema }),
  projectController.createTasks.bind(projectController),
);
router.post(
  '/',
  validate({ body: createProjectSchema }),
  projectController.createProject.bind(projectController),
);
router.patch(
  '/:id',
  validate({ params: idSchema, body: updateProjectSchema }),
  projectController.patchProject.bind(projectController),
);
router.delete(
  '/:id',
  validate({ params: idSchema }),
  projectController.deleteProject.bind(projectController),
);

export default router;
