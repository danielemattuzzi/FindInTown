// Middleware checking if the user is an admin
exports.verifyAdmin = async(req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accesso negato: solo per admin' });
  }
  next();
};
