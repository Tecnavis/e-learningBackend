const Discussion = require("../models/discussoionSchema");
const asyncHandler = require("express-async-handler");

// Create a new discussion
exports.createDiscussion = asyncHandler(async (req, res) => {
  const { documentId, chat, userId } = req.body;

  if (!documentId || !chat || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newDiscussion = new Discussion({
    documentId,
    chat,
    userId
  });

  const savedDiscussion = await newDiscussion.save();
  res.status(201).json({savedDiscussion, status: 201 });
});

// Get all discussions (optionally filter by documentId)
exports.getDiscussions = asyncHandler(async (req, res) => {
  const { documentId } = req.query;

  const filter = documentId ? { documentId } : {};

  const discussions = await Discussion.find(filter)
    .populate("userId", "name image") // populate selected fields of user

  res.status(200).json(discussions);
});

// get spcific document id
exports.geDocumentDiscussions = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
  
    const discussions = await Discussion.find({ documentId: id})
      .populate("userId", "name image") // populate selected fields of user
  
    res.status(200).json(discussions);
  });


// Get single discussion by ID
exports.getDiscussionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findById(id)
    .populate("userId", "name email")
    .populate("documentId", "title");

  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  res.status(200).json(discussion);
});

// Delete a discussion by ID
exports.deleteDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findByIdAndDelete(id);

  if (!discussion) {
    return res.status(404).json({ error: "Discussion not found" });
  }

  res.status(200).json({ message: "Discussion deleted successfully" });
});
