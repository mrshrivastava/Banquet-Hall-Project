import { Router } from 'express';
import { googleLogin, googleSignup } from '../controllers/authController.js';
import { getCategories, getCategoryItems, getCategoryItemById } from '../controllers/categoryController.js';
import { addFavourite, getFavourites, getUserDetails, updateUserDetails } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', googleLogin);
router.post('/signup', googleSignup);
router.get('/userDetails', protect, getUserDetails);
router.put('/userDetails', protect, updateUserDetails);
router.get('/categories', getCategories);
router.get('/categories/items', getCategoryItems);
router.get('/categories/items/:id', getCategoryItemById);
router.post('/addFavourite/:userId', protect, addFavourite);
router.get('/fav/:userId', protect, getFavourites);

export default router;
