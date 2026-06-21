const { verifyToken } = require('../services/jwtService');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Потрібна авторизація' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Невірний або прострочений токен' });
  }

  req.user = decoded;
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Потрібні права адміністратора' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };