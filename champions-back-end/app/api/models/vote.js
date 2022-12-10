const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema ({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    leadEmail: {
        type: String,
        trim: true,
        required: true
    },
    voterEmail: {
        type: String,
        trim: true,
        required: true,
    },
    voteDescription: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        trim: true,
        required: true
    },
    champId: { type: Schema.Types.ObjectId, ref: 'Champion' },
}, {
    timestamps: true
});


module.exports = mongoose.model('Vote', voteSchema);