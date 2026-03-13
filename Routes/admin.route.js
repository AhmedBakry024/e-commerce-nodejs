import * as adminController from "../Controllers/admin.controller.js";
import { isAdmin, protect } from "../Middlewares/protect.js";
import express from "express";
const router = express.Router();

router.get('/users', protect, isAdmin, adminController.getAllUsers);
router.post('/create-admin',protect, isAdmin, adminController.createAdmin);
router.put('/ban-user', protect, isAdmin, adminController.banUser);
router.put('/unban-user', protect, isAdmin, adminController.unbanUser);
router.get('/vouchers', protect, isAdmin, adminController.getAllVouchers);
router.post('/add-voucher', protect, isAdmin, adminController.addVoucher);
export default router;