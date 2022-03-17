const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "postule", // when a applicant is applied
        "entretien", // when a applicant is shortlisted
        "accepté", // when a applicant is accepted
        "rejeté", // when a applicant is rejeté
        "supprimé", // when any job is deleted
        "annulé", // an application is annulé by its author or when other application is accepted
        "achevé", // when job is over
      ],
      default: "postule ",
      required: true,
    },
    dateOfApplication: {
      type: Date,
      default: Date.now,
    },
    dateOfJoining: {
      type: Date,
      validate: [
        {
          validator: function (value) {
            return this.dateOfApplication <= value;
          },
          msg: "dateOfJoining should be greater than dateOfApplication",
        },
      ],
    },
    sop: {
      type: String,
      validate: {
        validator: function (v) {
          return v.split(" ").filter((ele) => ele != "").length <= 250;
        },
        msg: "Statement of purpose should not be greater than 250 words",
      },
    },
  },
  { collation: { locale: "en" } }
);

// schema.virtual("applicationUser", {
//   ref: "JobApplicantInfo",
//   localField: "userId",
//   foreignField: "userId",
//   justOne: true,
// });

// schema.virtual("applicationRecruiter", {
//   ref: "RecruiterInfo",
//   localField: "recruiterId",
//   foreignField: "userId",
//   justOne: true,
// });

// schema.virtual("applicationJob", {
//   ref: "jobs",
//   localField: "jobId",
//   foreignField: "_id",
//   justOne: true,
// });

module.exports = mongoose.model("applications", schema);
