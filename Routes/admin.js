import express from "express";
import { updateAdmin, deleteAdmin, getSingleAdmin, getAllAdmins, getAdminProfile } from "../Controllers/adminController.js";
import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/:id', authenticate, restrict(["admin"]), getSingleAdmin);
router.get('/', getAllAdmins);
router.put('/:id', authenticate, restrict(["admin"]), updateAdmin);
router.delete('/:id', authenticate, restrict(["admin"]), deleteAdmin);
router.get('/profile/me', authenticate, restrict(['admin']), getAdminProfile)

export default router;