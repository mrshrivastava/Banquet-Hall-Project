import { Router } from 'express'; import Listing from '../models/Listing.js'; import Review from '../models/Review.js'; import Interest from '../models/Interest.js'; import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res) => { const { category, city, minPrice, maxPrice, minRating, search, page = 1, limit = 12 } = req.query; const query = { isActive: true }; if (category) query.category = category; if (city) query.city = new RegExp(`^${city}$`, 'i'); if (minPrice || maxPrice) query.priceFrom = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) }; if (minRating) query.rating = { $gte: Number(minRating) }; if (search) query.$text = { $search: search }; const [items, total] = await Promise.all([Listing.find(query).populate('category', 'name slug').sort({ rating: -1, createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)), Listing.countDocuments(query)]); res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) }); });
router.get('/:id', async (req, res) => { const listing = await Listing.findById(req.params.id).populate('category'); if (!listing) return res.status(404).json({ message: 'Listing not found.' }); const reviews = await Review.find({ listing: listing._id }).populate('user', 'name').sort('-createdAt'); res.json({ listing, reviews }); });
router.post('/', protect, adminOnly, async (req, res) => res.status(201).json(await Listing.create(req.body)));
router.post('/:id/reviews', protect, async (req, res) => { const review = await Review.create({ listing: req.params.id, user: req.user._id, rating: req.body.rating, comment: req.body.comment }); const aggregate = await Review.aggregate([{ $match: { listing: review.listing } }, { $group: { _id: null, rating: { $avg: '$rating' }, count: { $sum: 1 } } }]); await Listing.findByIdAndUpdate(req.params.id, { rating: aggregate[0].rating, reviewCount: aggregate[0].count }); res.status(201).json(review); });
router.post('/:id/interests', async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id, isActive: true });
  if (!listing) return res.status(404).json({ message: 'Listing not found.' });
  const { name, phone, message, eventDate } = req.body;
  if (!name?.trim() || !phone?.trim()) return res.status(400).json({ message: 'Your name and phone number are required.' });
  const interest = await Interest.create({ listing: listing._id, name: name.trim(), phone: phone.trim(), message, eventDate });
  res.status(201).json(interest);
}); export default router;
