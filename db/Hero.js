const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    heroImage:{
      type:String
    },
    buttonText:{
      type:String
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("heros", schema);
