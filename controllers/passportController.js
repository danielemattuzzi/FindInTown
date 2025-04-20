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

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token }); 
    // We can also return as URL 
    // res.redirect(`http://localhost:3000?token=${token}`);
  }
];


