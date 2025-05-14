const express = require('express');
const router = express.Router();
const Controller = require('../controllers/syllabus');
const { uploadImageSingle } = require('../lib/multer');


router.post('/', uploadImageSingle, Controller.create); 
router.get('/', Controller.getAll);
router.get('/:id', Controller.get);
router.put('/:id', uploadImageSingle, Controller.update);
router.delete('/:id', Controller.delete);
router.delete('/:id/class/:no', Controller.deleteAClass);
router.put("/add-class/:id", uploadImageSingle, Controller.addClassToSyllabus);
router.put("/add-class/:id/subjects/:no", uploadImageSingle, Controller.addClassSubjectsToSyllabus);
router.put("/add-class/:id/class/:no/subjects/:subjectId", uploadImageSingle, Controller.editClassSubjectsToSyllabus);
router.delete('/:id/class/:no/subjects/:subjectId', Controller.deleteAClassSubject);
router.put("/add-class/:id/subjects/:no/chapters/:subjectId", Controller.addClassSubjectsChapterToSyllabus);
router.put("/add-class/:id/class/:no/subjects/:subjectId/chapters/:chapterId", Controller.editClassSubjectsChapterToSyllabus);
router.delete('/:id/class/:no/subjects/:subjectId/chapters/:chapterId', Controller.deleteAClassSubjectChapter);
router.put("/:id/class/:classNo/subject/:subjectTitle/chapter/:chapterTitle/rating", Controller.updateRating);



module.exports = router;
