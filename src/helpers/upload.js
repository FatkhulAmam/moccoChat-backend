const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(!file){
      return cb(new Error('Image cant be null'), false);
    }
    cb(null, 'assets/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const fileName = new Date().getTime().toString().concat('.').concat(ext)
    cb(null, fileName)
  }
})

let fileFilter = (req, file, cb) => {
  var ekstensi = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG'];
   if (ekstensi.includes(file.mimetype)) {
      return cb(null, true)
   }
      return cb(new Error('Invalid file type. Only image files are allowed.'), false);
}

module.exports = multer({
  storage,
  fileFilter,
  limit: {fileSize: 1024 * 1024}
})