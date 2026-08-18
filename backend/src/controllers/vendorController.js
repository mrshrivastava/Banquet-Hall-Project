import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import Interest from '../models/Interest.js';

const listingFields = ['category', 'name', 'description', 'city', 'state', 'address', 'location', 'priceFrom', 'capacity', 'contact', 'photos', 'projects', 'amenities'];
const cleanListing = body => Object.fromEntries(listingFields.filter(field => body[field] !== undefined).map(field => [field, body[field]]));

export const getVendorListings = async (req, res) => {
  const items = await Listing.find({ owner: req.user._id }).populate('category', 'name slug').sort('-updatedAt');
  res.json({ items });
};

export const createVendorListing = async (req, res) => {
  const data = cleanListing(req.body);
  if (!data.category || !data.name || !data.description || !data.city || data.priceFrom === undefined) return res.status(400).json({ message: 'Category, business name, description, city and starting price are required.' });
  req.user.isVendor = true;
  await req.user.save();
  const item = await Listing.create({ ...data, owner: req.user._id, isActive: true });
  res.status(201).json({ item: await item.populate('category', 'name slug'), isVendor: true });
};

const findOwnedListing = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404).json({ message: 'Business not found.' }); return null; }
  const item = await Listing.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) { res.status(404).json({ message: 'Business not found.' }); return null; }
  return item;
};

export const updateVendorListing = async (req, res) => {
  const item = await findOwnedListing(req, res); if (!item) return;
  Object.assign(item, cleanListing(req.body));
  await item.save();
  res.json({ item: await item.populate('category', 'name slug') });
};

export const deleteVendorListing = async (req, res) => {
  const item = await findOwnedListing(req, res); if (!item) return;
  item.isActive = false;
  await item.save();
  res.json({ deleted: true });
};

export const getVendorEnquiries = async (req, res) => {
  const ownedIds = await Listing.find({ owner: req.user._id }).distinct('_id');
  const items = await Interest.find({ listing: { $in: ownedIds } }).populate('listing', 'name city').populate('user', 'name email').sort('-createdAt');
  res.json({ items });
};

export const updateEnquiry = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Enquiry not found.' });
  const enquiry = await Interest.findById(req.params.id).populate('listing', 'owner');
  if (!enquiry || !enquiry.listing || enquiry.listing.owner.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Enquiry not found.' });
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid enquiry status.' });
  enquiry.status = req.body.status;
  await enquiry.save();
  res.json({ item: enquiry });
};
