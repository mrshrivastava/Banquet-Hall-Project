import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createVendorListing, deleteVendorListing, getVendorEnquiries, getVendorListings, updateEnquiry, updateVendorListing } from '../controllers/vendorController.js';
import { uploadVendorImage } from '../controllers/uploadController.js';

const router = Router();
router.use(protect);
router.post('/uploads', uploadVendorImage);
router.get('/listings', getVendorListings);
router.post('/listings', createVendorListing);
router.put('/listings/:id', updateVendorListing);
router.delete('/listings/:id', deleteVendorListing);
router.get('/enquiries', getVendorEnquiries);
router.patch('/enquiries/:id', updateEnquiry);
export default router;
