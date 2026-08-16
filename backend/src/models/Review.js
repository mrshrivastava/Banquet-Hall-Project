import mongoose from 'mongoose';
export default mongoose.model('Review', new mongoose.Schema({ listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, required: true, maxlength: 1000 } }, { timestamps: true }));
