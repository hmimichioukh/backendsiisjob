const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imageUser:{type:String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    datejoin:{
      type:Date,
      default:Date.now,
    },
    phone: {
      type: String,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("AdminInfo", schema);
