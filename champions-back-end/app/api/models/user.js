const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRound = 10; 

const Schema = mongoose.Schema;

const UserSchema = new Schema ( {
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        trim: true,
        required: true
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

// hash user password before saving into databas
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRound);
    next();
})

module.exports = mongoose.model('User', UserSchema);