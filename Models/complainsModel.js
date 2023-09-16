const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    
    user_id: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: Text,
        required: true
    },
    violationType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
},)
userSchema.set('timestamps', true);
const user = mongoose.model('User', userSchema);

module.exports = user;