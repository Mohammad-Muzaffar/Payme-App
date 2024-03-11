const mongoose = require('mongoose');
const { number } = require('zod');

// Add your cluster URL in the following:
mongoose.connect("<Your MongoDb cluster URL>/payme");

const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});
const User = mongoose.model('User', userShema);

const accountsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    balance: {
        type: Number,
        default: function() {
            return Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
        },
        required: true
    }
});
const Account = mongoose.model('Account', accountsSchema);

module.exports = {User, Account};