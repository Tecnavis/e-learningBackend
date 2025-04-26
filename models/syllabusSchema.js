const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    classes: [
      {
        no: {
          type: Number,
          required: true,
        },
        subjects: [
          {
            title: {
              type: String,
              required: true,
            },
            author: {
              type: String,
            },
            image: {
              type: String,
            },
            chapters: [
              {
                title: {
                  type: String,
                  required: true,
                },
                description: {
                  type: String,
                },
                rating: {
                  type: Number,
                },
                document: {
                  pdf: {
                    type: String,
                  },
                  video: {
                    type: String,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);
