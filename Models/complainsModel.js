const mongoose = require('mongoose');

const schema = mongoose.Schema;

const complainsSchema = new schema({
    user_id: {
        type: String,
        required: true,
        default: "650808b9e9e592216d5c2849"
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    violationType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    }
},)
complainsSchema.set('timestamps', true);
const complain = mongoose.model('Complain', complainsSchema);

module.exports = complain;