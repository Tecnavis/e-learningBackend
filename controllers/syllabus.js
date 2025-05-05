const SyllabusModel = require("../models/syllabusSchema");
const asyncHandler = require("express-async-handler");

// Create a new syllabus
exports.create = asyncHandler(async (req, res) => {
  try {

    let { title, classes } = req.body;

    if (typeof classes === 'string') {
      classes = JSON.parse(classes); // Parse the string into an array
    }

    const image = req.file ? req.file.filename : null;

    if (image) {
      classes.forEach(classObj => {
        classObj.subjects.forEach(subject => {
          subject.image = image; // Add image file name to each subject
        });
      });
    }

    // Create the syllabus in the database
    const syllabus = await SyllabusModel.create({ title, classes });
    res.status(200).json({ syllabus, status: 201 });
  } catch (error) {
    console.error("Error in creating syllabus:", error);
    res.status(500).json({ message: "An error occurred while creating the syllabus", error });
  }
});


// Get all syllabuses
exports.getAll = asyncHandler(async (req, res) => {
  const syllabuses = await SyllabusModel.find();
  res.status(200).json(syllabuses);
});

// Get syllabus by ID
exports.get = asyncHandler(async (req, res) => {
  const syllabus = await SyllabusModel.findById(req.params.id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }
  res.status(200).json(syllabus);
});

// Update a syllabus
exports.update = asyncHandler(async (req, res) => {
  const { title, classes } = req.body;
  const syllabus = await SyllabusModel.findByIdAndUpdate(
    req.params.id,
    { title, classes },
    { new: true }
  );
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }
  res.status(200).json(syllabus);
});

// Delete a syllabus
exports.delete = asyncHandler(async (req, res) => {
  const syllabus = await SyllabusModel.findByIdAndDelete(req.params.id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }
  res.status(200).json({ syllabus, status: 200  });
});

// delete a class

exports.deleteAClass = asyncHandler(async (req, res) => {
  const { id, no } = req.params;

  // Find the syllabus by ID
  const syllabus = await SyllabusModel.findById(id);
  
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  // Check if class exists
  const classIndex = syllabus.classes.findIndex(cls => cls.no === parseInt(no));
  if (classIndex === -1) {
    return res.status(404).json({ message: `Class ${no} not found in syllabus.` });
  }

  // Remove the class from the array
  syllabus.classes.splice(classIndex, 1);

  // Save the updated document
  await syllabus.save();

  res.status(200).json({ message: `Class ${no} deleted successfully`, syllabus, status: 200 });
});

// add new syllabus class

exports.addClassToSyllabus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Syllabus ID
  const newClass = JSON.parse(req.body.addSyllbusClass); // Parse the JSON string

  // Step 1: Find syllabus
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  // Step 2: Check if the `no` already exists
  const classExists = syllabus.classes.some(c => c.no === newClass.no);
  if (classExists) {
    return res.status(400).json({ message: `Class ${newClass.no} already exists.` });
  }

  // Step 3: Handle image upload
  const image = req.file ? req.file.filename : null;

  // If an image is uploaded, assign it to each subject in the class
  if (image) {
    newClass.subjects.forEach(subject => {
      subject.image = image; // Assign the image to each subject
    });
  }

  // Step 4: Push the new class into the syllabus
  syllabus.classes.push(newClass);
  await syllabus.save();

  res.status(200).json({ syllabus, status: 200 });
});

// Delete a syllabus class sbujucts

exports.deleteAClassSubject = asyncHandler(async (req, res) => {
  const { id, no, subjectId } = req.params;

  // Find the syllabus by ID
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  // Find the class by number
  const classObj = syllabus.classes.find(cls => cls.no === parseInt(no));
  if (!classObj) {
    return res.status(404).json({ message: `Class ${no} not found in syllabus.` });
  }

  // Find the subject index
  const subjectIndex = classObj.subjects.findIndex(subject => subject._id.toString() === subjectId);
  if (subjectIndex === -1) {
    return res.status(404).json({ message: "Subject not found in class." });
  }

  // Remove the subject
  classObj.subjects.splice(subjectIndex, 1);

  // Save the updated syllabus
  await syllabus.save();

  res.status(200).json({ message: "Subject deleted successfully", status: 200 });
});


// add new syllabus class subjects

exports.addClassSubjectsToSyllabus = asyncHandler(async (req, res) => {
  const { id, no } = req.params;
  
  const newSubject = JSON.parse(req.body.addSyllbusClass);
  
  
  // Find the syllabus by ID
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }
  
  // Find the specific class by "no"
  const classItem = syllabus.classes.find(c => c.no === Number(no));
  if (!classItem) {
    return res.status(400).json({ message: "Class not found." });
  }
  
  // Handle image upload
  const image = req.file ? req.file.filename : null;
  if (image) {
    newSubject.subjects.forEach(subject => {
      subject.image = image;
    });
  }

  // Push new subjects into the correct class
  classItem.subjects.push(...newSubject.subjects);  

  await syllabus.save();

  res.status(200).json({ syllabus, status: 200 });
});

// edit new syllabus class subject chapters 


exports.editClassSubjectsToSyllabus = asyncHandler(async (req, res) => {
  const { id, no, subjectId } = req.params;

  const updatedData = JSON.parse(req.body.addSyllbusClass);

  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  const classItem = syllabus.classes.find((c) => c.no === Number(no));
  if (!classItem) {
    return res.status(400).json({ message: "Class not found." });
  }

  const subject = classItem.subjects.find((s) => s._id.toString() === subjectId);
  if (!subject) {
    return res.status(404).json({ message: "Subject not found." });
  }

  // Update fields
  subject.title = updatedData.subjects[0].title || subject.title;
  subject.author = updatedData.subjects[0].author || subject.author;

  if (req.file) {
    subject.image = req.file.filename; // replace old image if new one is uploaded
  }

  await syllabus.save();

  res.status(200).json({ message: "Subject updated successfully", status: 200, subject });
});

// add new syllabus class subject chapters 
exports.addClassSubjectsChapterToSyllabus = asyncHandler(async (req, res) => {
  const { id, no, subjectId } = req.params;
  
  const newChapter =  req.body.chapters?.[0];
  
  // Find the syllabus
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  
  // Find the specific class
  const classItem = syllabus.classes.find(c => c.no === Number(no));
  if (!classItem) {
    return res.status(404).json({ message: "Class not found." });
  }

  // Find the specific subject
  const subject = classItem.subjects.find(s => s._id.toString() === subjectId);
  if (!subject) {
    return res.status(404).json({ message: "Subject not found in class." });
  }

  // Add the chapter
  subject.chapters.push(newChapter);

  await syllabus.save();

  res.status(200).json({ syllabus, status: 200 });
});

// edit  syllabus class subject chapters 

exports.editClassSubjectsChapterToSyllabus = asyncHandler(async (req, res) => {
  const { id, no, subjectId, chapterId } = req.params;

  const newChapterData = req.body.chapters?.[0];

  if (!newChapterData || !newChapterData.title || !newChapterData.description) {
    return res.status(400).json({ message: "Invalid chapter data." });
  }

  // Find the syllabus document
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found." });
  }

  // Find the class by number
  const classItem = syllabus.classes.find((cls) => cls.no === Number(no));
  if (!classItem) {
    return res.status(404).json({ message: "Class not found." });
  }

  // Find the subject by ID
  const subject = classItem.subjects.find(
    (subj) => subj._id.toString() === subjectId
  );
  if (!subject) {
    return res.status(404).json({ message: "Subject not found in class." });
  }

  // Find the chapter by ID
  const chapterIndex = subject.chapters.findIndex(
    (ch) => ch._id.toString() === chapterId
  );
  if (chapterIndex === -1) {
    return res.status(404).json({ message: "Chapter not found in subject." });
  }

  // Update the chapter data
  subject.chapters[chapterIndex] = {
    ...subject.chapters[chapterIndex]._doc,
    ...newChapterData,
  };

  // Save the updated syllabus
  await syllabus.save();

  res.status(200).json({ status: 200, message: "Chapter updated successfully", syllabus });
});

//  delete  syllabus class subject chapters 


exports.deleteAClassSubjectChapter = asyncHandler(async (req, res) => {
  const { id, no, subjectId, chapterId } = req.params;

  // Find the syllabus by ID
  const syllabus = await SyllabusModel.findById(id);
  if (!syllabus) {
    return res.status(404).json({ message: "Syllabus not found" });
  }

  // Find the class by number
  const classObj = syllabus.classes.find(cls => cls.no === parseInt(no));
  if (!classObj) {
    return res.status(404).json({ message: `Class ${no} not found in syllabus.` });
  }

  // Find the subject
  const subject = classObj.subjects.find(subject => subject._id.toString() === subjectId);
  if (!subject) {
    return res.status(404).json({ message: "Subject not found in class." });
  }

  // Remove the chapter
  subject.chapters = subject.chapters.filter(chap => chap._id.toString() !== chapterId);

  // Save the updated syllabus
  await syllabus.save();

  res.status(200).json({ message: "Chapter deleted successfully", status: 200 });
});



// Update rating for a specific chapter
exports.updateRating = async (req, res) => {
  const { id, classNo, subjectTitle, chapterTitle } = req.params;
  const { rating, userId } = req.body;

  try {
    const syllabus = await SyllabusModel.findById(id);
    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    const classObj = syllabus.classes.find(cls => cls.no === parseInt(classNo));
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    const subjectObj = classObj.subjects.find(sub => sub.title === subjectTitle);
    if (!subjectObj) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapterObj = subjectObj.chapters.find(chap => chap.title === chapterTitle);
    if (!chapterObj) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Initialize rating structure if not exists
    if (!chapterObj.rating) {
      chapterObj.rating = { ratings: [], average: 0 };
    }

    // Check if user already rated
    const alreadyRated = chapterObj.rating.ratings.find(r => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "User has already rated this chapter." });
    }

    // Push new rating
    chapterObj.rating.ratings.push({ userId, value: rating });

    // Calculate new average
    const totalRatings = chapterObj.rating.ratings.length;
    const sumRatings = chapterObj.rating.ratings.reduce((sum, r) => sum + r.value, 0);
    chapterObj.rating.average = sumRatings / totalRatings;

    await syllabus.save();

    res.status(200).json({ message: "Rating updated successfully", syllabus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


