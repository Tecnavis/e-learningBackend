const express = require('express');
const router = express.Router();
const Controller = require('../controllers/syllabus');
const upload = require('../lib/multer');


router.post('/', upload.single("image"), Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id', upload.single("image"), Controller.update);
router.delete('/:id', Controller.delete);
router.put("/add-class/:id", Controller.addClassToSyllabus);
router.put("/:id/class/:classNo/subject/:subjectTitle/chapter/:chapterTitle/rating", Controller.updateRating);



module.exports = router;
