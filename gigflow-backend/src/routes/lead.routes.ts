import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin, requireSalesOrAdmin } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

router.get('/', requireSalesOrAdmin, getLeads);
router.post('/', requireSalesOrAdmin, createLead);
router.get('/export', requireSalesOrAdmin, exportLeads);
router.get('/:id', requireSalesOrAdmin, getLeadById);
router.put('/:id', requireSalesOrAdmin, updateLead);
router.delete('/:id', requireAdmin, deleteLead);

export default router;