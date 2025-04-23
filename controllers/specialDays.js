const SpecialDaysModel = require("../models/specialDaysSchema");
const asyncHandler = require("express-async-handler");

//create special days
exports.create = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const image = req.file?.filename;
    const specialDays = await SpecialDaysModel.create({ image, title }); 
    res.status(200).json(specialDays);
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
    const image = req.file?.filename;
    const {title} = req.body;
    const specialDays = await SpecialDaysModel.findByIdAndUpdate(req.params.id, { image, title }, {
        new: true
    });
    res.status(200).json(specialDays);
}); 


//delete A special days
exports.delete = asyncHandler(async (req, res) => {
    const specialDays = await SpecialDaysModel.findByIdAndDelete(req.params.id);
    res.status(200).json(specialDays);
})

