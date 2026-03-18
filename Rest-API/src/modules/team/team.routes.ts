import { Router } from "express";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TeamRepository } from "./team.repository";
import { createTeamSchema, updateTeamSchema } from "./team.validators";
import { validate } from "../common/functions";

const router = Router();
const teamController = new TeamController(new TeamService(new TeamRepository()));


router.get("/", teamController.getAllTeams.bind(teamController));
router.get("/:id", teamController.getTeamById.bind(teamController));
router.post("/", validate(createTeamSchema), teamController.createTeam.bind(teamController));
router.put("/:id", validate(updateTeamSchema), teamController.updateTeam.bind(teamController));
router.delete("/:id", teamController.deleteTeam.bind(teamController));

export default router;
