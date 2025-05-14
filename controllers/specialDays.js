const SpecialDaysModel = require("../models/specialDaysSchema");
const asyncHandler = require("express-async-handler");

//create special days
exports.create = asyncHandler(async (req, res) => {
  const { title, pdf, date } = req.body;

//   const image =  req.file.filename ; 
  const image = req.cloudinaryImageUrl;


  // Create a new special day entry
  const specialDays = await SpecialDaysModel.create({
    image,
    title,
    pdf,
    date,
  });

  res.status(201).json({ specialDays, status: 201 });
});


//get all special days
exports.getAll = asyncHandler(async (req, res) => {
    const specialDays = await SpecialDaysModel.find();
    res.status(200).json(specialDays);
})  

//get by Id
exports.get = asyncHandler(async (req, res) => {
    const specialDays = await SpecialDaysModel.findById(req.params.id);
    res.status(200).json(specialDays);
})

//update A special days
exports.update = asyncHandler(async (req, res) => {
    // const image = req.file?.filename;
    const image = req.cloudinaryImageUrl;

    const { title, pdf, date } = req.body;
    
    const specialDays = await SpecialDaysModel.findByIdAndUpdate(req.params.id, { image, title, pdf, date }, {
        new: true
    });
    res.status(200).json({specialDays, status: 200  });
}); 


//delete A special days
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const specialDays = await SpecialDaysModel.findByIdAndDelete(id);
    res.status(200).json({specialDays,  status: 200 });
})

