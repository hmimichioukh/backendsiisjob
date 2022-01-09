const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const crypto = require('crypto')
const bcrypt = require("bcrypt");
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const nodemailer = require('nodemailer')
require("dotenv").config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
})

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    name: data.name,
    password: data.password,
    type: data.type,
  });
  
  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              phone: data.phone,
              bio: data.bio,
              address:data.address,
              email: data.email,

            })
          : new JobApplicant({
              userId: user._id,
              phone:user.phone,
              name: data.name,
              email:data.email,
              //education: data.education,
              //skills: data.skills,
              //rating: data.rating,
              resume: data.resume,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

//reset password
router.post('/reset',(req,res)=>{
const {email} = req.body
const token = buffer.toString("hex")
User.findOne({ email: email }, function (err, user) {
  if (err) {
    return res.status(500).send({ message: "An unexpected error occurred" });
  }
  if (!user) return res.status(404).send({ message: "No user found with this email address." });
 
  user.resetToken =token;
  user.expireToken  = moment().add(12, "hours");
  user.save(function(err){
    if (err) {
      return res.status(500).send({ message: "An unexpected error occurred" });
    }
    transporter.sendMail({
      to:user.email,
      from:process.env.EMAIL,
      subject:"password reset",
      html:`
      <p>You requested for password reset</p>
      <h5>click in this <a href="http://siisjob.herokuapp.com/resetpassword/reset/${token}">link</a> to reset password</h5>
      `
  })
  })

})
})
router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})
module.exports = router;
