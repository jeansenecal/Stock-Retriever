const mongoose = require('mongoose');

const ScrappedStockSchema = new mongoose.Schema({
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

module.exports = mongoose.model('scrappedStock', ScrappedStockSchema);