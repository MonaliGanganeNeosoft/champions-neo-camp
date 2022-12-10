const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const championSchema = new Schema ({
    firstName: {
        type: String,
        trim: true,
        require: true
    },
    lastName: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        trim: true,
        require: true,
    },
    department: {
        type: String,
        trim: true,
        require: true
    },
    location: {
        type: String,
        trim: true,
        require: true
    },
    leadEmail: {
        type: String,
        trim: true,
        require: true
    },
    role: {
        type: String,
        trim: true,
        require: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Champion', championSchema);