const express = require('express');
const router = express.Router();
const Controller = require('../controllers/specialDays');
const upload = require('../lib/multer');


router.post('/', upload.single("image"), Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id', upload.single("image"), Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
