import multer from 'multer';
import path from 'path';
import appRootPath from 'app-root-path';
import fs from 'fs';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = appRootPath + '/src/public/image/';

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname),
		);
	},
});

const imageFilter = function (req, file, cb) {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		req.fileValidationError = 'Only image files are allowed!';
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};

const upload = multer({
	storage: storage,
	fileFilter: imageFilter,
});

export default upload;
