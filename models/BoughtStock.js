const mongoose = require('mongoose');

const BoughtStockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    dateBought: {
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

module.exports = mongoose.model('boughtstock', BoughtStockSchema);