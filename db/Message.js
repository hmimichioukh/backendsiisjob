const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
        type: String,
        required: true,
      },
      sujet: {
        type: String,
        required: true,
      },
    message: {
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


module.exports = mongoose.model("messages", schema);
