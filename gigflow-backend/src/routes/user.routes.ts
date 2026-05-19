import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/', requireAdmin, getAllUsers);
router.patch('/:id/role', requireAdmin, updateUserRole);

export default router;