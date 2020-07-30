const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})


var photoUpload = (req, res, next) => {
   upload.single('userImage')
   res.json({message:"done"})
}

module.exports = {
    photoUpload
}