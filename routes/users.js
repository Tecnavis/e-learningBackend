const express = require('express');
const router = express.Router();
const Controller = require('../controllers/user');
const upload = require('../lib/multer');


router.post('/',  Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id', upload.single("image"), Controller.update);
router.delete('/:id', Controller.delete);
router.post("/login", Controller.login);


module.exports = router;
