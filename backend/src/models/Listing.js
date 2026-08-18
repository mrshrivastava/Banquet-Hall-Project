import mongoose from 'mongoose';
const listingSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  name: { type: String, required: true, trim: true, index: 'text' }, description: { type: String, required: true },
  city: { type: String, required: true, trim: true, index: true }, state: String, address: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  location: { latitude: Number, longitude: Number },
  priceFrom: { type: Number, required: true, min: 0, index: true }, capacity: Number, contact: { name: String, phone: String, email: String },
  photos: [String],
  projects: [{ title: { type: String, trim: true }, description: { type: String, trim: true }, photo: String }],
  amenities: [String], rating: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 }, isActive: { type: Boolean, default: true }
}, { timestamps: true });
listingSchema.index({ category: 1, city: 1, priceFrom: 1 });
export default mongoose.model('Listing', listingSchema);
