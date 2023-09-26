const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
},);

userSchema.pre('save', function(next){
    const user = this 
    
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash
        next()
    })
})

userSchema.pre('findOneAndUpdate', function(next){
    const user = this 
    
    bcrypt.hash(user._update.password, 10, (error, hash) => {
        user._update.password = hash
        next()
    })
})
    
userSchema.set('timestamps', true);
const user = mongoose.model('User', userSchema);

module.exports = user;