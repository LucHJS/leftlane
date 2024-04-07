const {model, Schema} = require("mongoose")

let minesschema = new Schema({
    MemberID: String,
    Balance: {
        type: Number,
        default: 0
    }

})

module.exports = model("Mines", minesschema)