import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true }, city: { type: String, trim: true }, state: { type: String, trim: true },
  // Password is optional because accounts created through Google do not have one.
  password: { type: String, minlength: 8, select: false },
  googleId: { type: String, unique: true, sparse: true, index: true },
  avatar: { type: String, trim: true },
  isAdmin: { type: Boolean, default: false },
  isVendor: { type: Boolean, default: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
}, { timestamps: true });
userSchema.pre('save', async function () { if (this.isModified('password') && this.password) this.password = await bcrypt.hash(this.password, 12); });
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
export default mongoose.model('User', userSchema);
