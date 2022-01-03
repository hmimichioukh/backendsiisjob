const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    TestSectionImage: {
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


module.exports = mongoose.model("testmonialsimages", schema);
