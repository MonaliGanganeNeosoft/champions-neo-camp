const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const championOfWeekSchema = new Schema ({
    status: {
        type: Boolean,
        required: true
    },
    voteCount: {
        type: Number,
        required: true
    },
    weekDate: {
        type: String,
        required: true
    },
    leadEmail: {
        type: String,
        trim: true,
        required: true
    },
    champId: { type: Schema.Types.ObjectId, ref: 'Champion', required: true },
}, {
    timestamps: true
});


module.exports = mongoose.model('ChampionOfWeek', championOfWeekSchema);