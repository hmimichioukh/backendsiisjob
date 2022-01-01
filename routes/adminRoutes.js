const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const upload = require("../lib/uploadimg");
const uploadcv = require("../lib/uploadcv");
const uploadjob = require("../lib/uploadjob");
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Testmonial = require("../db/Testmonial");
const Newsletter = require("../db/Newsletter");
const Message =require("../db/Message")
const Admin = require("../db/Admin")
const router = express.Router();
// get all users
router.get("/users",jwtAuth,(req, res) => {

    //let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
  
  
  
     User.find().collation({ locale: "en" }).sort().skip().limit()
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json(posts);
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
//get all Recruiter
router.get("/recruiter",jwtAuth,(req, res) => {

    //let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
  
  
  
     Recruiter.find().collation({ locale: "en" }).sort().skip().limit()
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json(posts);
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
//get all Consultnats
router.get("/consultans",jwtAuth,(req, res) => {

    //let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
  
  
  
     JobApplicant.find().collation({ locale: "en" }).sort().skip().limit()
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json(posts);
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
// get all jobs
router.get("/jobs",jwtAuth,(req, res) => {

    //let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
  
  
  
     Job.find().collation({ locale: "en" }).sort().skip().limit()
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json(posts);
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
    //delete a user
router.delete("/users/:id",jwtAuth,(req, res) => {
    //let user = req.user;  
    User.findOne()
    User.findOneAndDelete({
        _id: req.params.id,      
     })
      .then((posts) => {
        if (posts == null) {
          res.status(401).json({
            message: "You dont have permission to delete this user",
          });
          return;
        }
        res.json({
            message: "User deleted successfully",

        });
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
  // ajouter un testmonial
router.post("/testmonials",jwtAuth,(req, res) => {
    
    const data = req.body;

      let testmonial = new Testmonial({
          name:data.name,
          message:data.message,
          domain:data.domain,
      });
    testmonial
    .save()
    .then(() => {
       res.json({ message: "testmonial added successfully to the database"});
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
  //get all testmonials
  router.get("/testmonials",jwtAuth,(req, res)=>{
    let query = {};
    let limit = 5;
    let sort  = {dateOfpost:-1}
    Testmonial.find(query).sort(sort).limit(limit)
    .then((posts)=>{
        if(posts == null){
            res.status(404).json({
                message: "No Testmonial found"
            });
            return
        }
        res.json(posts);
    })
    .catch((err) => {
        res.status(400).json(err);
    })
  });
  // ajouter homepage content
  router.post("/newsletter",jwtAuth,(req, res) => {
    
    const data = req.body;

      let newsletter = new Newsletter({
          title:data.title,
          message:data.message,
          buttonText:data.buttonText
      });
    newsletter
    .save()
    .then(() => {
       res.json({ message: "News letter added successfully to the database"});
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
  //get all the messages
  router.get('/messages',jwtAuth,(req,res) => {
    let query = {};
    let limit = 5;
    let sort  = {dateOfpost:-1}
    Message.find(query).sort(sort).limit(limit)
    .then((posts)=>{
        if(posts == null){
            res.status(404).json({
                message: "Message found"
            });
            return
        }
        res.json(posts);
    })
    .catch((err) => {
        res.status(400).json(err);
    }) 
  })
  router.delete('/messages/:id',jwtAuth,(req,res) => {
    Message.findOneAndDelete({
        _id:req.params.id
    })
    .then((message)=>{
        if(message=== null){
            res.status(401).json({
                message: "You don't have permissions to delete the message",

            })
            return;

        }
        res.json({
            message: "Job deleted successfully",
          });
    })
    .catch((err) => {
        res.status(400).json(err);
      });
  })
  
  // connexion
  router.post('/login',(req, res,next)=>{
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
  // inscription
  router.post('/signup',(req, res)=>{
    const data =req.body;
    let user = new User({
       name:data.name,
       email:data.email,
       password:data.password,
       phone:data.phone,
       type:data.type,

    })
    user.save()
    .then(()=>{
      //tokens.
      const userDetails = 
      user.type=="admin"?
      new Admin({
        userId: user._id,
        name:data.name,
        email:data.email,
        password:data.password,
        phone:data.phone,
        type:data.type,
      })
      :(
        console.log("not allowed")
      )
     userDetails.save()
     .then(()=>{
      const token = jwt.sign({_id:user._id},authKeys.jwtSecretKey)
      res.json({
        token: token,
        type:user.type
      })
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
  })
 
module.exports = router;