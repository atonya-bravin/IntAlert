const mongoose = require('mongoose');

const schema = mongoose.Schema;
const {v4, uuidv4} = require('uuidv4');

const userSchema = new schema({
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},)
userSchema.set('timestamps', true);
const user = mongoose.model('User', userSchema);

module.exports = user;