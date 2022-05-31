require('dotenv').config();
var express = require("express");
var router = express.Router();
var Controllers = require("../controllers");
var multerGoogleStorage = require('multer-google-storage');

const Multer = require('multer');

var uploadHandler = Multer({
	storage: multerGoogleStorage.storageEngine({
		autoRetry: true,
		bucket: BUCKETNAME,
		projectId: PROJECTID,
		keyFilename: KEYFILENAME,
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

router.post('/', multer.single('label'), (req, res) => {
	if (req.body.product) {
		let productData = {
			imgPath: req.file.path,
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

router.post('/test', (req, res) => {
	let productData = {
		imgPath: process.env.TEST_IMG,
		productName: "TEST PRODUCT",
		userID: "TEST ID"
	};
	Controllers.visionController.processLabel(productData, res);
});

module.exports = router;