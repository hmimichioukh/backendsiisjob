const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    buttonText:{
        type: String,
        required: true,
    },
    dateOfpost: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "en" } }
);


module.exports = mongoose.model("newsletter", schema);
