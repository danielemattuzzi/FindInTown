const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Fixed typo in variable name
const User = require('../models/User'); 

const { JWT_SECRET } = process.env; // JWT secret from environment variables

// API: POST /auth/register to register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role} = req.body;

    const userExists = await User.findOne({ email }); // email is unique in the User model
    if (userExists) return res.status(400).json({ error: 'Email già in uso' });

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
};

// API: POST /auth/login to log in a user

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenziali non valide' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
        res.status(500).json({ error: 'Errore del server' });
  }
};