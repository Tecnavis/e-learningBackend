const express = require('express');
const router = express.Router();
const Controller = require('../controllers/banner');
const { uploadImageArray, uploadImageSingle } = require('../lib/multer');


// Use .array() to handle multiple images
router.post('/', uploadImageArray, Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id/no/:index', uploadImageSingle, Controller.update);
router.delete('/',   Controller.deleteAll);
router.delete('/:id/no/:index',  Controller.delete);

module.exports = router;
