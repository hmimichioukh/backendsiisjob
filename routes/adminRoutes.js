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
const Hero = require("../db/Hero")
const Step = require("../db/Step")
const Partenaire = require("../db/Partenaire")
const TestmonialImage = require("../db/TestmonialImage")
const About = require("../db/About")

const router = express.Router();
// create a about
router.post("/about",jwtAuth,(req, res)=>{
  const data = req.body
  let about = new About({
    titleTop: data.titleTop,
    siisDes:data.siisDes,
    siisMission:data.siisMission,
    siisEnt: data.siisEnt,
    siisCan:data.siisCan,
    titleSecondary:data.titleSecondary,
    titleleft: data.titleleft,
    titleRight: data.titleRight,
    buttonText: data.buttonText,
    imageTop: data.imageTop,
  });
  about
  .save()
  .then(()=>{
    res.json({ message: "about added successfully  to the database",
   id:about._id,
  });
  })
  .catch((err) => {
    res.status(400).json(err);
  });
})
// get about 
router.get('/about',jwtAuth,(req,res)=>{
  let query = {};
  let limit = 1;
  let sort  = {dateOfPosting:-1}
  About.find(query).sort(sort).limit(limit)
  .then((posts)=>{
      if(posts == null){
          res.status(404).json({
              message: "No About found"
          });
          return
      }
      res.json(posts);
  })
  .catch((err) => {
      res.status(400).json(err);
  })
})
// update about 
router.put('/about/:id',jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
  About.findOne({ 
    _id:req.params.id
  })
  .then((about) => {
    if(about == null){
      res.status(404).json({
        message: "about dont exist"
      })
      return;
    }
    const data = req.body
    if(data.titleTop){
      about.titleTop = data.titleTop
    }
    if(data.titleSecondary){
      about.titleSecondary = data.titleSecondary
    }
    if(data.siisDes){
      about.siisDes = data.siisDes
    }
    if(data.siisMission){
      about.siisMission = data.siisMission
    }
    if(data.siisCan){
      about.siisCan = data.siisCan
    }
    if(data.siisEnt){
      about.siisEnt = data.siisEnt
    }
    if(data.titleleft){
      about.titleleft = data.titleleft
    }
    if(data.titleRight){
      about.titleRight = data.titleRight
    }
    if(data.buttonText){
      about.buttonText = data.buttonText
    }
    about
    .save()
    .then(() => {
      res.json({ message:"about details updated successfully"})
    })
    .catch((err) => {
      res.status(400).json(err);
    });
})
.catch((err) => {
  res.status(400).json(err);
});
})
// create a partenaire
router.post("/partenaire",jwtAuth,(req, res)=>{
  const data = req.body
  let partenaire = new Partenaire({
    name: data.name,
    partImage: data.partImage,
  });
  partenaire
  .save()
  .then(()=>{
    res.json({ message: "partenaire added successfully  to the database",
   id:partenaire._id,
  });
  })
  .catch((err) => {
    res.status(400).json(err);
  });
})
// create the steps object
router.post("/steps",jwtAuth,(req, res)=>{
  const data = req.body
  let step = new Step({
    title: data.title,
    stepIcon: data.stepIcon,
    content: data.content,
  });
  step
  .save()
  .then(()=>{
    res.json({ message: "Step added successfully  to the database",
   id:step._id,
  });
  })
  .catch((err) => {
    res.status(400).json(err);
  });
})
// delete the step
router.delete('/steps/:id',jwtAuth,(req,res)=>{
  const user = req.user;
  if(user.type != 'admin')
  {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
 Step.findOneAndDelete({
   _id:req.params.id
 })
 .then((step)=>{
   if(step === null){
     res.status(401).json({
      message: "You don't have permissions to delete the hero",
    })
    return
   }
   res.json({
    message: "Hero deleted successfully",

   })
 })
 .catch((err) => {
  res.status(400).json(err);
});
})
// update step
router.put('/steps/:id',jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the step details",
    });
    return;
  }
  Step.findOne({ 
    _id:req.params.id
  })
  .then((step) => {
    if(step == null){
      res.status(404).json({
        message: "step dont exist"
      })
      return;
    }
    const data = req.body
    if(data.title){
      step.title = data.title
    }
    if(data.stepIcon){
      step.heroImage = data.stepIcon
    }
    if(data.buttonText){
      step.content = data.content
    }
    step
    .save()
    .then(() => {
      res.json({ message:"step details updated successfully"})
    })
    .catch((err) => {
      res.status(400).json(err);
    });
})
.catch((err) => {
  res.status(400).json(err);
});
})
// create the hero content 
router.post("/hero",jwtAuth,(req, res)=>{
  const data = req.body
  let hero = new Hero({
    title: data.title,
    heroImage: data.heroImage,
    buttonText: data.buttonText,
  });
  hero
  .save()
  .then(()=>{
    res.json({ message: "Hero added successfully  to the database",
   id:hero._id,
  });
  })
  .catch((err) => {
    res.status(400).json(err);
  });
})
// delete the hero
router.delete('/hero/:id',jwtAuth,(req,res)=>{
  const user = req.user;
  if(user.type != 'admin')
  {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
 Hero.findOneAndDelete({
   _id:req.params.id
 })
 .then((hero)=>{
   if(hero === null){
     res.status(401).json({
      message: "You don't have permissions to delete the hero",
    })
    return
   }
   res.json({
    message: "Hero deleted successfully",

   })
 })
 .catch((err) => {
  res.status(400).json(err);
});
})
// update hero
router.put('/hero/:id',jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
  Hero.findOne({ 
    _id:req.params.id
  })
  .then((hero) => {
    if(hero == null){
      res.status(404).json({
        message: "Hero dont exist"
      })
      return;
    }
    const data = req.body
    if(data.title){
      hero.title = data.title
    }
    if(data.heroImage){
      hero.heroImage = data.heroImage
    }
    if(data.buttonText){
      hero.buttonText = data.buttonText
    }
    hero
    .save()
    .then(() => {
      res.json({ message:"hero details updated successfully"})
    })
    .catch((err) => {
      res.status(400).json(err);
    });
})
.catch((err) => {
  res.status(400).json(err);
});
})
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
          testImage:data.testImage,
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

// ahouter image testmonial
router.post("/testmonialsimage",jwtAuth,(req, res) => {
    
  const data = req.body;

    let testImage = new TestmonialImage({
      TestSectionImage:data.TestSectionImage,
      
    });
    testImage
  .save()
  .then(() => {
     res.json({ message: "Testmonial image added successfully to the database",
    id:testImage._id});
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});
// get all testmonial images from the database
router.get('/testmonialsimage',jwtAuth,(req,res) => {
  let query = {};
  let limit = 4;
  let sort  = {dateOfpost:-1}
  TestmonialImage.find(query).sort(sort).limit(limit)
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
  // ajouter newsletter content
router.post("/newsletter",jwtAuth,(req, res) => {
    
    const data = req.body;

      let newsletter = new Newsletter({
          title:data.title,
          message:data.message,
          newsImage:data.newsImage,
          buttonText:data.buttonText
      });
    newsletter
    .save()
    .then(() => {
       res.json({ message: "News letter added successfully to the database",
      id:newsletter._id});
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
  
router.delete('/newsletter/:id',jwtAuth,(req, res)=>{
    const user = req.user;
    if(user.type != "admin"){
      res.status(401).json({
        message: "You don't have permissions to delete the newsletter",
      });
      return;
    }
    Newsletter.findOneAndDelete({
      _id:req.params.id,
    })
    .then((newsletter)=>{
      if(newsletter === null){
          res.status(401).json({
              message: "You don't have permissions to delete the newsletter",

          })
          return;

      }
      res.json({
          message: "newsletter deleted successfully",
        });
  })
  .catch((err) => {
      res.status(400).json(err);
    });
  })
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