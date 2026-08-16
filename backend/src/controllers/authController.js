import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const googleClient = new OAuth2Client();

const googleClientIds = () => (process.env.GOOGLE_CLIENT_ID || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

const userResponse = user => ({
  token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    city: user.city,
    state: user.state,
    avatar: user.avatar,
    isAdmin: user.isAdmin
  }
});

const getGoogleProfile = async req => {
  const idToken = req.body.idToken || req.body.credential || req.body.token;
  const audience = googleClientIds();
  if (!idToken) {
    const error = new Error('A Google ID token is required.');
    error.status = 400;
    throw error;
  }
  if (!audience.length) {
    const error = new Error('Google sign-in is not configured. Set GOOGLE_CLIENT_ID.');
    error.status = 500;
    throw error;
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || !profile.email_verified) throw new Error('Google account email is not verified.');
    return profile;
  } catch (cause) {
    const error = new Error(cause.message === 'Google account email is not verified.' ? cause.message : 'Google ID token is invalid or expired.');
    error.status = 401;
    throw error;
  }
};

export const googleSignup = async (req, res) => {
  const profile = await getGoogleProfile(req);
  const email = profile.email.toLowerCase();
  const existing = await User.findOne({ $or: [{ googleId: profile.sub }, { email }] });
  if (existing) return res.status(409).json({ message: 'An account already exists for this Google account. Please log in.' });

  const user = await User.create({
    googleId: profile.sub,
    name: profile.name || email.split('@')[0],
    email,
    avatar: profile.picture
  });
  res.status(201).json(userResponse(user));
};

export const googleLogin = async (req, res) => {
  const profile = await getGoogleProfile(req);
  const email = profile.email.toLowerCase();
  const user = await User.findOne({ $or: [{ googleId: profile.sub }, { email }] });
  if (!user) return res.status(404).json({ message: 'No account exists for this Google account. Please sign up.' });

  // Link a legacy email/password account only after the Google token is verified.
  if (!user.googleId) {
    user.googleId = profile.sub;
    user.avatar ||= profile.picture;
    await user.save();
  }
  res.json(userResponse(user));
};
