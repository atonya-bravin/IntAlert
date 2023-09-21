const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},)
userSchema.set('timestamps', true);
const user = mongoose.model('User', userSchema);

module.exports = user;