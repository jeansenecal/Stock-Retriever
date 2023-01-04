const mongoose = require('mongoose');

const BoughtStockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('stockScoreGreater10', BoughtStockSchema);