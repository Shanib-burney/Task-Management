import { Router } from 'express';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { addMemberIdSchema, createTeamSchema, updateTeamSchema } from './team.validators';
import { validate } from '../shared/middlewares/validation.middleware';
import { idSchema, pagingSchema } from '../shared/utils/utils';

const router = Router();
const teamController = new TeamController(new TeamService(new TeamRepository()));

router.get('/', validate({ query: pagingSchema }), teamController.getAllTeams.bind(teamController));
router.get('/:id', validate({ params: idSchema }), teamController.getTeamById.bind(teamController));
router.post(
  '/',
  validate({ body: createTeamSchema }),
  teamController.createTeam.bind(teamController),
);
router.post(
  '/:id/member/:userId',
  validate({ params: addMemberIdSchema }),
  teamController.addMember.bind(teamController),
);
router.patch(
  '/:id',
  validate({ params: idSchema, body: updateTeamSchema }),
  teamController.patchTeam.bind(teamController),
);
router.delete(
  '/:id',
  validate({ params: idSchema }),
  teamController.deleteTeam.bind(teamController),
);

export default router;
