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
  let user = req.user;
  if(user.type != "admin"){
    res.status(401).json({
      message: "You don't have permissions to see this",
    });
    return;

  }
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
    if(data.imageTop){
      about.imageTop = data.imageTop
    }
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
      res.json({ message:"about details updated successfully",
      titleTop:about.titleTop})
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
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
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
// get partenaires
router.get('/partenaire',jwtAuth,(req,res)=>{
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
  let limit = 9;
  let query = {};
  let sort  = {dateOfPosting:1}
  Partenaire.find(query).sort(sort).limit()
  .then((posts)=>{
      if(posts == null){
          res.status(404).json({
              message: "No Partenaire found"
          });
          return
      }
      res.json(posts);
  })
  .catch((err) => {
      res.status(400).json(err);
  })
})
// Delete partenaires
router.delete('/partenaire/:id',jwtAuth,(req,res)=>{
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
  Partenaire.findOneAndDelete({_id:req.params.id})
  .then((post)=>{
      if(post == null){
          res.status(401).json({
              message: "You don't have permissions to delete the job"
          });
          return
      }
      res.json({
        message: "Job deleted successfully",
      });
      })
  .catch((err) => {
      res.status(400).json(err);
  })
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
// get hero details
router.get('/hero',jwtAuth,(req,res)=>{
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the step details",
    });
    return;
  }
  let query = {};
  let limit = 1;
  let sort  = {dateOfPosting:-1}
  Hero.find(query).sort(sort).limit(limit)
  .then((posts)=>{
      if(posts == null){
          res.status(404).json({
              message: "No Hero found"
          });
          return
      }
      res.json(posts);
  })
  .catch((err) => {
      res.status(400).json(err);
  })
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
    
    let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
     if(user.type != "admin"){
      res.status(401).json({
        message: "You don't have permissions to see This",
      });
      return;
    }
  
  
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

    let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
    if(user.type != "admin"){
      res.status(401).json({
        message: "You don't have permissions to add jobs",
      });
      return;
    }
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

    let user = req.user;
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
  
     if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to see this infos",
      });
      return;
    }
    let sort  = {datejoin:-1}
    JobApplicant.find().collation({ locale: "en" }).sort(sort).skip().limit()
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
router.get("/jobs",jwtAuth,async(req, res) => {

    let user = req.user;
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to add jobs",
      });
      return;
    }
     //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
    let sort  = {dateOfPosting:-1}
  const page = parseInt(req.query.page) ? parseInt(req.query.page) :1;
  const limit = parseInt(req.query.index) ? parseInt(req.query.index) : 6;
  const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
  const total = await Job.countDocuments({})
  const numberPages = Math.ceil(total / limit)
  Job.find({}).collation({ locale: "en" }).sort(sort).skip(skip).limit(limit)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      res.json({
        numberPages,
        page,
        limit,
        data:posts,
      });
      //console.log(posts)
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
router.get("/countjobs",async(req, res) => {

  //let user = req.user;

  let findParams = {};
  let sortParams = {};

  // to list down jobs posted by a particular recruiter
  /*if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }
*/
// search bar
  if (req.query.title) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.title, "i"),
      },
    };
  }
  if (req.query.address) {
    findParams = {
      ...findParams,
      address: {
        $regex: new RegExp(req.query.address, "i"),
      },
    };
  }
// type de job
  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }
  // metier
  if (req.query.domain) {
    let domain = [];
    if (Array.isArray(req.query.domain)) {
      domain = req.query.domain;
    } else {
      domain = [req.query.domain];
    }
    console.log(domain);
    findParams = {
      ...findParams,
      domain: {
        $in: domain,
      },
    };
  }
  // experince 
  if (req.query.experince) {
    let experince = [];
    if (Array.isArray(req.query.experince)) {
      experince = req.query.experince;
    } else {
      experince = [req.query.experince];
    }
    console.log(experince);
    findParams = {
      ...findParams,
      experince: {
        $in: experince,
      },
    };
  }
  if (req.query.contrat) {
    let contrat = [];
    if (Array.isArray(req.query.contrat)) {
      contrat = req.query.contrat;
    } else {
      contrat = [req.query.contrat];
    }
    console.log(contrat);
    findParams = {
      ...findParams,
      contrat: {
        $in: contrat,
      },
    };
  }
  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        $lt: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  console.log(findParams);
  console.log(sortParams);

 

   //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)

  let arr = [
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter"
      },
      
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  console.log(arr);
  let sort  = {dateOfPosting:-1}
  const page = parseInt(req.query.page) ? parseInt(req.query.page) :1;
  const limit = parseInt(req.query.index) ? parseInt(req.query.index) : 9;
  const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
  const total = await Job.countDocuments({})
  const numberPages = Math.ceil(total / limit)
  Job.find(findParams).collation({ locale: "en" }).sort(sort).skip(skip).limit(limit)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      res.json({
        total,
        });
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
  let user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }
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
  // delete a testmonial
router.delete("/testmonials/:id",jwtAuth,(req, res) => {
    let user = req.user;
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to add jobs",
      });
      return;
    }
    Testmonial.findOneAndDelete({
      _id:req.params.id
    })
    .then((step)=>{
      if(step === null){
        res.status(401).json({
         message: "You don't have permissions to delete the Testmonial",
       })
       return
      }
      res.json({
       message: "Testmonial deleted successfully",
   
      })
    })
    .catch((err) => {
     res.status(400).json(err);
   });
    });
 //get all testmonials
router.get("/testmonials",jwtAuth,(req, res)=>{
  let user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }
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
router.get("/newsletter",(req, res)=>{
    let query = {};
    let limit = 1;
    let sort  = {dateOfpost:-1}
    Newsletter.find(query).sort(sort).limit(limit)
    .then((posts)=>{
        if(posts == null){
            res.status(404).json({
                message: "No Newsletter found"
            });
            return
        }
        res.json(posts);
    })
    .catch((err) => {
        res.status(400).json(err);
    })
  });
  // delete Newsletter
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

//update newsletter
router.put('/newsletter/:id',jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "You don't have permissions to change the hero details",
    });
    return;
  }
  Newsletter.findOne({ 
    _id:req.params.id
  })
  .then((news) => {
    if(news == null){
      res.status(404).json({
        message: "Hero dont exist"
      })
      return;
    }
    const data = req.body
    if(data.title){
      news.title = data.title
    }
    if(data.message){
      news.message = data.message
    }
    if(data.newsImage){
      news.newsImage = data.newsImage
    }
    if(data.buttonText){
      news.buttonText = data.buttonText
    }
    news
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
router.post("/jobs", jwtAuth,uploadjob.single("jobImage") ,(req, res) => {
    const user = req.user;
  console.log(user.name)
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to add jobs",
      });
      return;
    }
    //const jobImage =req.body
    const data = req.body;
  
    let job = new Job({
      userId: user._id,
      name: "SIIS Jobs",
      jobImage :data.jobImage, 
      domain:data.domain,
      contrat:data.contrat,
      TeleTravailler:data.TeleTravailler,
      experince:data.experince,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      maxApplicants: data.maxApplicants,
      maxPositions: data.maxPositions,
      dateOfPosting: data.dateOfPosting,
      deadline: data.deadline,
      skillsets: data.skillsets,
      taches: data.taches,
      jobType: data.jobType,
      duration: data.duration,
      salary: data.salary,
      rating: data.rating,
      address: data.address,
  
    });
  
    job
      .save()
      .then(() => {
         res.json({ message: "Job added successfully to the database",
         skillsets: job.skillsets});
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
// create a consultant
router.post("/consultant",jwtAuth,(req, res)=>{
  const user = req.user;
  console.log(user.name)
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to add Consultant",
      });
      return;
    }
    const data = req.body;
  let consultant = new User({
    email: data.email,
    name: data.name,
    password: data.password,
    type: data.type,
  });
  
  consultant
    .save()
    .then(() => {
      const userDetails =
            new JobApplicant({
              userId: user._id,
              phone:user.phone,
              name: data.name,
              email:data.email,
              resume: data.resume,
              profile: data.profile,
            });
      userDetails
        .save()
        .then(() => {
          res.json({
            message: "Cosnultan ajouter",
          });
        })
        .catch((err) => {
          consultant
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
})
router.post("/enterprise",jwtAuth,(req, res)=>{
  const user = req.user;
  console.log(user.name)
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to add Consultant",
      });
      return;
    }
    const data = req.body;
  let consultant = new User({
    email: data.email,
    name: data.name,
    password: data.password,
    type: data.type,
  });
  
  consultant
    .save()
    .then(() => {
      const userDetails =
            new Recruiter({
              userId: user._id,
              name: data.name,
              phone: data.phone,
              bio: data.bio,
              address:data.address,
              email: data.email,
            })
      userDetails
        .save()
        .then(() => {
          res.json({
            message: "Cosnultan ajouter",
          });
        })
        .catch((err) => {
          consultant
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
})

//get enterprise candidates
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "admin") {
    let findParams = {};
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});
// get consultant candidates

router.get("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  user.type = "applicant"
  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
  let findParams = {};

  if (req.params.id) {
    findParams = {
      ...findParams,
      userId: id,
    };
  }
  let arr = [
       {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];
  console.log(findParams);
  Application.find(findParams).collation({ locale: "en" }).sort().skip().limit()
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

/*
  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });*/
});
// get user by id
router.get("/applicant/:id",jwtAuth, (req, res) => {
  const user = req.user;
  console.log(user.name)
    if (user.type != "admin") {
      res.status(401).json({
        message: "You don't have permissions to See Consultant",
      });
      return;
    }
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }
      JobApplicant.findOne({ userId: userData._id })
      .then((applicant) => {
        if (applicant === null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(applicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
module.exports = router;