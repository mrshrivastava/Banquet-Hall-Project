import { Router } from 'express'; import Category from '../models/Category.js'; import { protect, adminOnly } from '../middleware/auth.js';
const router = Router(); router.get('/', async (_, res) => res.json(await Category.find().sort('name'))); router.post('/', protect, adminOnly, async (req, res) => res.status(201).json(await Category.create(req.body))); export default router;
