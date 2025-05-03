const mongoose = require("mongoose");

const specialDaysSchema = new mongoose.Schema({
    title: {
       type: String,
       required: true
    },
    image: {
        type: String, 
        required: true
    },
    pdf: {
        type: String,
      },
    date: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("specialDays", specialDaysSchema);