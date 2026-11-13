import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'senz-dev-secret-change-me';
const EXPIRES = process.env.JWT_EXPIRES_IN || '30d';

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

export function signToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name, role: 'admin' },
    SECRET,
    { expiresIn: EXPIRES }
  );
}

export function signCustomerToken(customer) {
  return jwt.sign(
    { sub: customer.id, phone: customer.phone, name: customer.name, role: 'customer' },
    SECRET,
    { expiresIn: EXPIRES }
  );
}

export function requireAdmin(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'لطفاً وارد حساب کاربری شوید.' });
  try {
    const payload = jwt.verify(token, SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'دسترسی به این بخش مجاز نیست.' });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'نشست شما منقضی شده است. دوباره وارد شوید.' });
  }
}

export function requireCustomer(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'برای این بخش باید وارد حساب کاربری شوید.' });
  try {
    const payload = jwt.verify(token, SECRET);
    if (payload.role !== 'customer') {
      return res.status(403).json({ error: 'دسترسی به این بخش مجاز نیست.' });
    }
    req.customer = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'نشست شما منقضی شده است. دوباره وارد شوید.' });
  }
}

/** Attaches req.customer when a valid customer token is present, but never blocks. */
export function optionalCustomer(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, SECRET);
      if (payload.role === 'customer') req.customer = payload;
    } catch {
      /* ignore invalid tokens for public routes */
    }
  }
  next();
}
