const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");
const upload = require("../lib/uploadimg");
const uploadcv = require("../lib/uploadcv");
const uploadjob = require("../lib/uploadjob");
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Rating = require("../db/Rating");
const Testmonial = require("../db/Testmonial");
const Newsletter = require("../db/Newsletter");
const Message =require("../db/Message")
const Hero = require("../db/Hero")
const Step = require("../db/Step")
const About = require("../db/About")
const Partenaire = require("../db/Partenaire")
const TestmonialImage = require("../db/TestmonialImage")
const router = express.Router();

router.get('/testmonialsimage',(req,res) => {
  let query = {};
  let limit = 1;
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
// get hero details
router.get('/hero',(req,res)=>{
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
// get about details
router.get('/about',(req,res)=>{
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
// get steps
router.get('/steps',(req,res)=>{
  let query = {};
  let limit = 5;
  let sort  = {dateOfPosting:1}
  Step.find(query).sort(sort).limit(limit)
  .then((posts)=>{
      if(posts == null){
          res.status(404).json({
              message: "No Setps found"
          });
          return
      }
      res.json(posts);
  })
  .catch((err) => {
      res.status(400).json(err);
  })
})
// get Partenaire
router.get('/partenaire',(req,res)=>{
  let query = {};
  let limit = 5;
  let sort  = {dateOfPosting:1}
  Partenaire.find(query).sort(sort).limit(limit)
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
//send a message to the admin 
router.post("/contact",(req, res) => {
    
  const data = req.body;

    let message = new Message({
        name:data.name,
        message:data.message,
        sujet:data.sujet,
        phone:data.phone,
        email:data.email,

    });
  message
  .save()
  .then(() => {
     res.json({ message: "Message successfully Sended"});
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});
//to get the testmonial
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
router.get("/testmonials",(req, res)=>{
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
// To add new job
router.post("/jobs", jwtAuth,uploadjob.single("jobImage") ,(req, res) => {
  const user = req.user;
  //const name = req.name;
console.log(user.name)
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }
  //const jobImage =req.body
  const data = req.body;

  let job = new Job({
    userId: user._id,
    name: user.name,
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
// to get 10 jobs for home page
router.get("/homeJobs",(req, res)=>{
let query = {};
let limit = 8;
let sort  = {dateOfPosting:-1}
Job.find(query).sort(sort).limit(limit)
.then((posts)=>{
  if(posts==null){
    res.status(404).json({
      message:"No Jobs Found"
    });
    return;
  }
  res.json(posts)
})
.catch((err)=>{
  res.status(400).json({err})
})
});
// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs",async(req, res) => {

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
  const limit = parseInt(req.query.index) ? parseInt(req.query.index) : 6;
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


// get suggest jobs for a user 
router.get('/suggest',jwtAuth,async(req,res)=>{
    let user = req.user;
    if (user.type != "applicant") {
      res.status(401).json({
        message: "You Look like you are not applicant",
      });
      return;
    }
   
    Job.aggregate([
      { $sample: { size: 6 } }
  ]).then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json({
         data:posts,
        });
        //console.log(posts)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
})
// after click suggest
router.get("/jobsuggest",jwtAuth,async(req, res) => {

  let user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "You Look like you are not applicant",
    });
    return;
  }
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

// type de job
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



//to get jobs poted by a recruiter
router.get("/myJobs",jwtAuth,(req, res) => {
  
  let user = req.user;

  let findParams = {};
  let sortParams = {};


  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

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

  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 33;
  const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

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

  Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
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
// to get info about a particular job
router.get("/jobs/:id", (req, res) => {
 

  Job.findOne({ _id: req.params.id })
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Job does not exist",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to update info of a particular job
router.put("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to change the job details",
    });
    return;
  }
  Job.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Job does not exist",
        });
        return;
      }
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Job details updated successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to delete a job
router.delete("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
  Job.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "You don't have permissions to delete the job",
        });
        return;
      }
      res.json({
        message: "Job deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
// update profile pic 
router.post("/userupload", jwtAuth,upload.single("imageUser"), (req, res)=>{
  const user   = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.imageUser) {
          recruiter.imageUser = data.imageUser;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "Enterprise  image  updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.imageUser) {
          jobApplicant.imageUser = data.imageUser;
        }
     
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "Profile image  updated successfully",
              imageUser:jobApplicant.imageUser,

            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});
// upload cv 
router.post("/useruploadcv", jwtAuth,uploadcv.single("cv"), (req, res)=>{
  const user   = req.user;
  const data   = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (imageEnterprise) {
          recruiter.imageEnterprise = imageEnterprise;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "Profile cv  updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.cv) {
          jobApplicant.cv = req.body.cv;
        }
     
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "Profile cv  updated successfully",
              cv:jobApplicant.cv,

            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});
// update user details
router.put("/user", jwtAuth,upload.single("imageUser"), (req, res) => {
  const user   = req.user;
  const data   = req.body;
  //const upload = req.file.path;
  //console.log(req.file.path);
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.phone) {
          recruiter.phone = data.phone;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        if (data.email) {
          recruiter.email = data.email;
        }
        if (data.address) {
          recruiter.address = data.address;
        }
        if (data.webUrl) {
          recruiter.webUrl = data.webUrl;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = req.body.name;
        }
        if (data.email) {
          jobApplicant.email = req.body.email;
        }
        if (data.phone) {
          jobApplicant.phone = req.body.phone;
        }
        if (data.address) {
          jobApplicant.address = req.body.address;
        }
        if (data.sexe) {
          jobApplicant.sexe = req.body.sexe;
        }
        if (data.age) {
          jobApplicant.age = req.body.age;
        }
        if (data.linkend) {
          jobApplicant.linkend = req.body.linkend;
        }
        if (data.domain) {
          jobApplicant.domain = req.body.domain;
        }
        if (data.experince) {
          jobApplicant.experince = req.body.experince;
        }
        if (data.cv) {
          jobApplicant.cv = req.body.cv;
        }
        /*
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        if (data.resume) {
          jobApplicant.resume = data.resume;
        }
        if (data.profile) {
          jobApplicant.profile = data.profile;
        }*/
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
              age:jobApplicant.age,
              experince:jobApplicant.experince,
              domain:jobApplicant.domain,
              linkend:jobApplicant.linkend,
              experince:jobApplicant.experince,
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// apply for a job [todo: test: done]
router.post("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "You don't have permissions to apply for a job",
    });
    return;
  }
  const data = req.body;
  const jobId = req.params.id;

  // check whether applied previously
  // find job
  // check count of active applications < limit
  // check user had < 10 active applications && check if user is not having any accepted jobs (user id)
  // store the data in applications

  Application.findOne({
    userId: user._id,
    jobId: jobId,
    status: {
      $nin: ["deleted", "accepted", "cancelled"],
    },
  })
    .then((appliedApplication) => {
      console.log(appliedApplication);
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "You have already applied for this job",
        });
        return;
      }

      Job.findOne({ _id: jobId })
        .then((job) => {
          if (job === null) {
            res.status(404).json({
              message: "Job does not exist",
            });
            return;
          }
          Application.countDocuments({
            jobId: jobId,
            status: {
              $nin: ["rejected", "deleted", "cancelled", "finished"],
            },
          })
            .then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxApplicants) {
                Application.countDocuments({
                  userId: user._id,
                  status: {
                    $nin: ["rejected", "deleted", "cancelled", "finished"],
                  },
                })
                  .then((myActiveApplicationCount) => {
                    if (myActiveApplicationCount < 10) {
                      Application.countDocuments({
                        userId: user._id,
                        status: "accepted",
                      }).then((acceptedJobs) => {
                        if (acceptedJobs < 10) {
                          const application = new Application({
                            userId: user._id,
                            recruiterId: job.userId,
                            jobId: job._id,
                            status: "applied",
                            sop: data.sop,
                          });
                          application
                            .save()
                            .then(() => {
                              res.json({
                                message: "Job application successful",
                                jobName:job.title,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.status(400).json({
                            message:
                              "You already have an accepted job. Hence you cannot apply.",
                          });
                        }
                      });
                    } else {
                      res.status(400).json({
                        message:
                          "You have 10 active applications. Hence you cannot apply.",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Application limit reached",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.json(400).json(err);
    });
});
// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to view job applications",
    });
    return;
  }
  const jobId = req.params.id;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    // .skip(skip)
    // .limit(limit)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

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
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
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
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  // "applied", // when a applicant is applied
  // "shortlisted", // when a applicant is shortlisted
  // entertien
  // "accepted", // when a applicant is accepted
  // "rejected", // when a applicant is rejected
  // "deleted", // when any job is deleted
  // "cancelled", // an application is cancelled by its author or when other application is accepted
  // "finished", // when job is over

  if (user.type === "recruiter") {
    if (status === "accepted") {
      // get job id from application
      // get job info for maxPositions count
      // count applications that are already accepted
      // compare and if condition is satisfied, then save

      Application.findOne({
        _id: id,
        recruiterId: user._id,
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Application not found",
            });
            return;
          }

          Job.findOne({
            _id: application.jobId,
            userId: user._id,
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Job does not exist",
              });
              return;
            }

            Application.countDocuments({
              recruiterId: user._id,
              jobId: job._id,
              status: "accepted",
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application.status = status;
                application.dateOfJoining = req.body.dateOfJoining;
                application
                  .save()
                  .then(() => {
                    if (status === "accepted") {
                      Job.findOneAndUpdate(
                        {
                          _id: job._id,
                          userId: user._id,
                        },
                        {
                          $set: {
                            acceptedCandidates: activeApplicationCount + 1,
                          },
                        }
                      )
                        .then(() => {
                          res.json({
                            message: `Application ${status} successfully`,
                          });
                        })
                        .catch((err) => {
                          res.status(400).json(err);
                        });
                    } else {
                      res.json({
                        message: `Application ${status} successfully`,
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "All positions for this job are already filled",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Application status cannot be updated",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "You don't have permissions to update job status",
      });
    }
  }
});

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recuiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
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

// to add or update a rating [todo: test]
router.put("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type === "recruiter") {
    // can rate applicant
    Rating.findOne({
      senderId: user._id,
      receiverId: data.applicantId,
      category: "applicant",
    })
      .then((rating) => {
        if (rating === null) {
          console.log("new rating");
          Application.countDocuments({
            userId: data.applicantId,
            recruiterId: user._id,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "applicant",
                  receiverId: data.applicantId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.applicantId),
                          category: "applicant",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        // update the user's rating
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;

                        JobApplicant.findOneAndUpdate(
                          {
                            userId: data.applicantId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((applicant) => {
                            if (applicant === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating applicant's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "Applicant didn't worked under you. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.applicantId),
                    category: "applicant",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  // update the user's rating
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  JobApplicant.findOneAndUpdate(
                    {
                      userId: data.applicantId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((applicant) => {
                      if (applicant === null) {
                        res.status(400).json({
                          message:
                            "Error while updating applicant's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating updated successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    // applicant can rate job
    Rating.findOne({
      senderId: user._id,
      receiverId: data.jobId,
      category: "job",
    })
      .then((rating) => {
        console.log(user._id);
        console.log(data.jobId);
        console.log(rating);
        if (rating === null) {
          console.log(rating);
          Application.countDocuments({
            userId: user._id,
            jobId: data.jobId,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "job",
                  receiverId: data.jobId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.jobId),
                          category: "job",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;
                        Job.findOneAndUpdate(
                          {
                            _id: data.jobId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((foundJob) => {
                            if (foundJob === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating job's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "You haven't worked for this job. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          // update the rating
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.jobId),
                    category: "job",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  console.log(avg);

                  Job.findOneAndUpdate(
                    {
                      _id: data.jobId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((foundJob) => {
                      if (foundJob === null) {
                        res.status(400).json({
                          message: "Error while updating job's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating added successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get personal rating
router.get("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  Rating.findOne({
    senderId: user._id,
    receiverId: req.query.id,
    category: user.type === "recruiter" ? "applicant" : "job",
  }).then((rating) => {
    if (rating === null) {
      res.json({
        rating: -1,
      });
      return;
    }
    res.json({
      rating: rating.rating,
    });
  });
});

// Application.findOne({
//   _id: id,
//   userId: user._id,
// })
//   .then((application) => {
//     application.status = status;
//     application
//       .save()
//       .then(() => {
//         res.json({
//           message: `Application ${status} successfully`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   })
//   .catch((err) => {
//     res.status(400).json(err);
//   });

// router.get("/jobs", (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       res.status(401).json(info);
//       return;
//     }
//   })(req, res, next);
// });
// get all company 
router.get("/enterprise",(req, res) => {

  //let user = req.user;
   //Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)

   Recruiter.find().collation({ locale: "en" }).sort().skip().limit()
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No Company found",
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
// get company info by ID
router.get("/enterprise/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }
      Recruiter.findOne({ userId: userData._id })
      .then((recruiter) => {
        if (recruiter === null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//get Jobs of one company 
router.get("/enterpriseJobs/:id",(req, res) => {
  
  let id = req.params.id;

  let findParams = {};
  let sortParams = {};


  // to list down jobs posted by a particular recruiter
  if (req.params.id) {
    findParams = {
      ...findParams,
      userId: id,
    };
  }

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

  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 33;
  const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

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

  Job.find(findParams).collation({ locale: "en" }).sort(sortParams).skip(skip).limit(limit)
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


module.exports = router;
