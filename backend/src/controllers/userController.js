import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const isObjectId = value => mongoose.isValidObjectId(value);
const publicUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  state: user.state,
  avatar: user.avatar,
  isAdmin: user.isAdmin,
  isVendor: user.isVendor
});

export const getUserDetails = async (req, res) => res.json({ user: publicUser(req.user) });

export const updateUserDetails = async (req, res) => {
  const allowed = ['name', 'phone', 'city', 'state'];
  for (const field of allowed) if (req.body[field] !== undefined) req.user[field] = req.body[field];
  await req.user.save();
  res.json({ user: publicUser(req.user) });
};

const requireCurrentUser = (req, res) => {
  if (req.params.userId !== req.user._id.toString()) {
    res.status(403).json({ message: 'You can only access your own favourites.' });
    return false;
  }
  return true;
};

export const addFavourite = async (req, res) => {
  if (!requireCurrentUser(req, res)) return;
  const itemId = req.query.itemId || req.body.itemId;
  if (!isObjectId(itemId)) return res.status(400).json({ message: 'A valid itemId is required.' });
  const item = await Listing.findOne({ _id: itemId, isActive: true });
  if (!item) return res.status(404).json({ message: 'Item not found.' });

  const alreadyFavourited = req.user.favourites.some(id => id.toString() === itemId);
  if (!alreadyFavourited) {
    req.user.favourites.push(itemId);
    await req.user.save();
  }
  res.status(alreadyFavourited ? 200 : 201).json({ favourited: true, itemId, favourites: req.user.favourites });
};

export const getFavourites = async (req, res) => {
  if (!isObjectId(req.params.userId)) return res.status(400).json({ message: 'A valid userId is required.' });
  if (!requireCurrentUser(req, res)) return;
  const user = await User.findById(req.user._id).populate({
    path: 'favourites',
    match: { isActive: true },
    populate: { path: 'category', select: 'name slug' }
  });
  res.json({ items: user.favourites, total: user.favourites.length });
};
