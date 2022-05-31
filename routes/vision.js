require('dotenv').config();
var express = require("express");
var router = express.Router();
var Controllers = require("../controllers");
var multerGoogleStorage = require('multer-google-storage');

const Multer = require('multer');

var uploadHandler = Multer({
	storage: multerGoogleStorage.storageEngine({
		autoRetry: true,
		bucket: process.env.BUCKETNAME,
		projectId: process.env.PROJECTID,
		keyFilename: process.env.KEYFILENAME,
		filename: (req, file, cb) => {
			cb(null, `${Date.now()}_${file.originalname}`);
		}
	})
})

router.post('/', uploadHandler.any(), function (req, res) {
	console.log(req.files);
	if (req.body.product) {
		let productData = {
			imgPath: req.files[0].path,
			productName: req.body.product,
			userID: req._passport['session']['user']
		};
		Controllers.visionController.processLabel(productData, res);
	}
	else {
		res.json({
			statusCode: 400,
			message: "Failed: Missing data"
		});
	}
});

module.exports = router;