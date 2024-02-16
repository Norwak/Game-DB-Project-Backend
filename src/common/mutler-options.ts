import { diskStorage } from "multer";

export const mutlerOptions = {storage: diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.mimetype === 'image/jpeg') {
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    } else {
      cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
  }
})};