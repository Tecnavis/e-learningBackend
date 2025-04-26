const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussion");

router.post("/", discussionController.createDiscussion);
router.get("/", discussionController.getDiscussions);
router.get("/documen/:id", discussionController.geDocumentDiscussions);
router.get("/:id", discussionController.getDiscussionById);
router.delete("/:id", discussionController.deleteDiscussion);

module.exports = router;
