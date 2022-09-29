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

module.exports = mongoose.model('stockScoreGreater10', ScrappedStockSchema);
module.exports = mongoose.model('stockScoreGreater50', ScrappedStockSchema);
module.exports = mongoose.model('stockScoreGreater200', ScrappedStockSchema);
module.exports = mongoose.model('stockScoreGreater1000', ScrappedStockSchema);