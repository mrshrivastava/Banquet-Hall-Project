import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => { const header = req.headers.authorization; if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Please sign in.' }); try { const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET); req.user = await User.findById(id); if (!req.user) throw Error(); next(); } catch { res.status(401).json({ message: 'Your session is invalid or expired.' }); } };
export const adminOnly = (req, res, next) => req.user?.isAdmin ? next() : res.status(403).json({ message: 'Admin access required.' });
