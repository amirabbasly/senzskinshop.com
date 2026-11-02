import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'senz-dev-secret-change-me';
const EXPIRES = process.env.JWT_EXPIRES_IN || '30d';

export function signToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name, role: admin.role },
    SECRET,
    { expiresIn: EXPIRES }
  );
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'لطفاً وارد حساب کاربری شوید.' });
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'نشست شما منقضی شده است. دوباره وارد شوید.' });
  }
}
