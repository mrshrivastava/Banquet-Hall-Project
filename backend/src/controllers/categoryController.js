import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Listing from '../models/Listing.js';

export const getCategories = async (_, res) => res.json(await Category.find().sort('name'));

export const getCategoryItems = async (req, res) => {
  const { category, categoryId, city, minPrice, maxPrice, minRating, search } = req.query;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const query = { isActive: true };
  const categoryValue = categoryId || category;
  if (categoryValue) {
    if (mongoose.isValidObjectId(categoryValue)) query.category = categoryValue;
    else {
      const matchingCategory = await Category.findOne({ slug: categoryValue });
      if (!matchingCategory) return res.json({ items: [], total: 0, page, pages: 0, limit: 10 });
      query.category = matchingCategory._id;
    }
  }
  if (city) query.city = new RegExp(`^${String(city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  if (minPrice || maxPrice) query.priceFrom = {
    ...(minPrice !== undefined && minPrice !== '' && { $gte: Number(minPrice) }),
    ...(maxPrice !== undefined && maxPrice !== '' && { $lte: Number(maxPrice) })
  };
  if (minRating !== undefined && minRating !== '') query.rating = { $gte: Number(minRating) };
  if (search) query.$text = { $search: String(search) };

  const limit = 10;
  const [items, total] = await Promise.all([
    Listing.find(query).populate('category', 'name slug').sort({ rating: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Listing.countDocuments(query)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit), limit: 10 });
};

export const getCategoryItemById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Item not found.' });
  const item = await Listing.findOne({ _id: req.params.id, isActive: true }).populate('category', 'name slug');
  if (!item) return res.status(404).json({ message: 'Item not found.' });
  res.json({ item });
};
