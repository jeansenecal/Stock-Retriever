const mongoose = require('mongoose');

const ScheduledJobHistorySchema = new mongoose.Schema({
    lastrun: {
        type: Date
    }
});

module.exports = mongoose.model('scheduledjobhistory', ScheduledJobHistorySchema);