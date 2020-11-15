const mongoose = require('mongoose');

const EntertainmentSchema = mongoose.Schema({
    news: {
        type: Object,
        required: true
    },

})

module.exports = mongoose.model('Entertainment', EntertainmentSchema);