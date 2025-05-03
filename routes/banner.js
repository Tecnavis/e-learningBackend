const express = require('express');
const router = express.Router();
const Controller = require('../controllers/banner');
const upload = require('../lib/multer');


// Use .array() to handle multiple images
router.post('/', upload.array("images", 10), Controller.create); // 10 is the max number of images allowed
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id/no/:index', upload.single("image"), Controller.update);
router.delete('/',   Controller.deleteAll);
router.delete('/:id/no/:index',  Controller.delete);

module.exports = router;
