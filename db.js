const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log('✅ Connesso a MongoDB'))
    .catch((err) => console.error('❌ Errore nella connessione', err));

// define the schema 
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// to use the schema, we need to convert it to a model
const User = model('User', userSchema);


// CRUD Operations 
// Create
const newUser = new User({
    name : 'John Doe',
    email : 'email@example.com', 
    password : 'password123'
});
// Save the user to the database
newUser.save()
    .then(() => console.log('✅ Utente creato'))
    .catch((err) => console.error('❌ Errore nella creazione dell\'utente', err));

// Find the userId of "John Doe"
// Using async / await to 
async function updateAndDeleteUser() {
    try {
        // Find user by name: "John Doe"
        const user = await User.findOne({ name: 'John Doe' });

        if (user) {
            const userId = user._id;  // getting the ObjectId of the user
            console.log('✅ ObjectId di John:', userId);

            // 1. update User
            const updatedUser = await User.findByIdAndUpdate(userId, { name: 'Jane Doe' }, { new: true });
            console.log('✅ Utente aggiornato:', updatedUser);

            // 2. Delete after update
            await User.findByIdAndDelete(userId);
            console.log('✅ Utente eliminato');
        } else {
            console.log('❌ Utente non trovato');
        }
    } catch (err) {
        console.error('❌ Errore durante le operazioni:', err);
    }
}

// execute the function
updateAndDeleteUser();

