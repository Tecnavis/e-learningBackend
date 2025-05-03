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


exports.addClassToSyllabus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Syllabus ID
  const newClass = JSON.parse(req.body.addSyllbusClass); // Parse the JSON string

  console.log(newClass, "newClass");  // Check the structure of newClass

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


