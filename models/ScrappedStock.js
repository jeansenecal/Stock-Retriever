const mongoose = require('mongoose');

const ScrappedStockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    history:[{
        score: Number,
        price: Number,
        date: Date
    }]
});

module.exports = mongoose.model('scrappedStock', ScrappedStockSchema);