const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, `${__dirname}/../public/uploads/`);
    },
    filename:(req,file, cb)=>{
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});
const filefilter = (req, file, cb) => {
    if(file.mimtype === 'image/png' || 'image/jpg' || 'image/jpeg' ){
        cb(null,true);
    }else{
        cb(null,false)
    }
}
const upload = multer(
    {storage:storage,
    fileFilter:filefilter
});
 

module.exports = upload;