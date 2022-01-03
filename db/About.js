const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    titleTop: {
      type: String,
    },
    titleSecondary: {
        type: String,
      },
    siisDes: {
        type: String,
      },
    siisMission: {
        type: String,
      },
    siisCan: {
        type: String,
      },
      siisEnt: {
        type: String,
      },
    titleleft: {
        type: String,
    },
    titleRight: {
        type: String,
    },
    imageTop: {
      type: String,
    },
    buttonText:{
        type: String,
    },
    dateOfpost: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "en" } }
);


module.exports = mongoose.model("abouts", schema);
