const express = require('express');
const router = express.Router();
const Controller = require('../controllers/specialDays');
const { uploadImageSingle } = require('../lib/multer');


router.post('/', uploadImageSingle, Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id', uploadImageSingle, Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
