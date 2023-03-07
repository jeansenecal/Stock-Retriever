const mongoose = require('mongoose');

const SoldStockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    returnPercentage: {
        type: Number,
        required: true
    },
    return: {
        type: Number,
        required: true
    },
    hype: {
        type: Number,
        required: true
    },
    soldPrice: {
        type: Number,
        required: true
    },
    dateBought: {
        type: Date,
        required: true
    },
    dateSold: {
        type: Date,
        required: true
    },
    boughtPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model('soldstock', SoldStockSchema);