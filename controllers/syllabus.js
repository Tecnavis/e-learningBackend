const SyllabusModel = require("../models/syllabusSchema");
const asyncHandler = require("express-async-handler");

// Create a new syllabus
exports.create = asyncHandler(async (req, res) => {
  const { title, classes } = req.body;
  const syllabus = await SyllabusModel.create({ title, classes });
  res.status(200).json(syllabus);
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
  res.status(200).json(syllabus);
});

exports.addClassToSyllabus = asyncHandler(async (req, res) => {
    const { id } = req.params; // Syllabus ID
    const newClass = req.body; // Contains `no`, `subjects`, etc.
  
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
  
    // Step 3: Push the new class
    syllabus.classes.push(newClass);
    await syllabus.save();
  
    res.status(200).json(syllabus);
  });
  