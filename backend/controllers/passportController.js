const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../middleware/passport');

exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
});

exports.googleCallback = [
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticazione fallita, utente non trovato' });
    }

    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // You can return the token in the response
    // res.json({ token }); 
    // We can also return as URL (better for frontend)
    res.redirect(`http://localhost:5173/home?token=${token}`);
  }
];


