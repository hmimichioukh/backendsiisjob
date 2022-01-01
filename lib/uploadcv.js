const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, process.cwd() + "/cv/");
    },
    filename:(req,file, cb)=>{
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});
const filefilter = (req, file, cb) => {
    if(file.mimtype === 'file/pdf' || 'file/docx' ){
        cb(null,true);
    }else{
        cb(null,false)
    }
}
const uploadcv = multer(
    {storage:storage,
    fileFilter:filefilter
});
 

module.exports = uploadcv;