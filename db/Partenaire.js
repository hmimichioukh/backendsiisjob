const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    partImage:{
      type:String,
      required: true,
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("partenaires", schema);
