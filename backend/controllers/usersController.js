const User = require('../models/User');

// API: GET /user/me to get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: PUT /users/me to update current user profile
exports.updateCurrentUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
};


// API: DELETE /users/me delete current user profile
exports.deleteCurrentUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) return res.status(404).json({ error: 'Utente non trovato' });
    res.json({ message: 'Utente eliminato con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
};

// API: GET /user/profile to get all user profiles
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: GET /user/profile/:userId to get user profile
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' }); 

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

/* 
// ----------------- TEST INIZIALE DEL FUNZIONAMENTO -----------------
// API: POST /user/profile to create a new user profile
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, createdAt} = req.body;
    const newUser = new User({ name, email, password, createdAt });
    const savedUser = await newUser.save();

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) { // duplicate key error
      return res.status(400).json({ error: 'Email già registrata' });
    }
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: PUT /user/profile/:id to update user profile
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email , password},
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: DELETE /user/profile/:id to delete user profile
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: 'Utente non trovato' });
    res.json({ message: 'Utente eliminato con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
}; 
*/ 