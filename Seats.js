const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    reservedSeat : {
        type : Array
    }
})

module.exports = mongoose.model("seats",seatSchema)