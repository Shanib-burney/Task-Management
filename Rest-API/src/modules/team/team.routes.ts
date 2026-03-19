import { Router } from "express";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TeamRepository } from "./team.repository";
import { createTeamSchema, updateTeamSchema } from "./team.validators";
import { validate } from "../shared/middlewares/validation.middleware";
import { z } from "zod";

const router = Router();
const teamController = new TeamController(new TeamService(new TeamRepository()));

const teamIdSchema = z.object({ id: z.coerce.number().int().positive() });

router.get("/", teamController.getAllTeams.bind(teamController));
router.get("/:id", validate({ params: teamIdSchema }), teamController.getTeamById.bind(teamController));
router.post("/", validate({ body: createTeamSchema }), teamController.createTeam.bind(teamController));
router.put("/:id", validate({ params: teamIdSchema, body: updateTeamSchema }), teamController.updateTeam.bind(teamController));
router.delete("/:id", validate({ params: teamIdSchema }), teamController.deleteTeam.bind(teamController));

export default router;
