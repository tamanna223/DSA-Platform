import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function signToken(user) {
  const payload = { id: user._id.toString(), email: user.email };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const options = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
}
