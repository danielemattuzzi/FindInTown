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

    // Use environment variable for frontend URL or fallback to deployed URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://danielemattuzzi.github.io/FindTest';
    
    // You can return the token in the response
    // res.json({ token }); 
    // We can also return as URL (better for frontend)
    res.redirect(`${frontendUrl}/?token=${token}`);
  }
];


