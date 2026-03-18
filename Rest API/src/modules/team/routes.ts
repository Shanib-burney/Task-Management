import { Router } from "express";
import { TeamController } from "./controller.js";
import { TeamService } from "./service.js";
import { TeamRepository } from "./repository.js";
import { createTeamSchema, updateTeamSchema } from "./validators.js";

const router = Router();
const teamController = new TeamController(new TeamService(new TeamRepository()));

const validate = (schema: any) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.errors });
  }
  req.body = result.data;
  next();
};

router.get("/", teamController.getAllTeams.bind(teamController));
router.get("/:id", teamController.getTeamById.bind(teamController));
router.post("/", validate(createTeamSchema), teamController.createTeam.bind(teamController));
router.put("/:id", validate(updateTeamSchema), teamController.updateTeam.bind(teamController));
router.delete("/:id", teamController.deleteTeam.bind(teamController));

export default router;
