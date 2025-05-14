const BannerModel = require("../models/bannerSchema");
const asyncHandler = require("express-async-handler");

//create banner

exports.create = asyncHandler(async (req, res) => {
    try {
      // const images = req.files.map(file => file.filename);
      const images = req.cloudinaryImageUrl;
      
      if (!images.length) {
        return res.status(400).json({ message: "No images uploaded" });
      }
  
      // Check if a banner document already exists (only one allowed)
      let banner = await BannerModel.findOne();
  
      if (banner) {
        // Just push new images into the existing document
        banner.images.push(...images);
        await banner.save();
      } else {
        // If none exists, create a new one
        banner = await BannerModel.create({ images });
      }
  
      res.status(200).json({ status: 200, images: banner.images });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Error uploading images" });
    }
  });
  

//get all banner
exports.getAll = asyncHandler(async (req, res) => {
    const banner = await BannerModel.find();
    res.status(200).json(banner);
})  

//get by Id
exports.get = asyncHandler(async (req, res) => {
    const banner = await BannerModel.findById(req.params.id);
    res.status(200).json(banner);
})

//update banner
exports.update = asyncHandler(async (req, res) => {
    // const image = req.file?.filename; 
    const image = req.cloudinaryImageUrl
    const { id, index } = req.params;
  
    if (!image) {
      return res.status(400).json({ message: "No image uploaded" });
    }
  
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
  
    const imageIndex = parseInt(index);
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= banner.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }
  
    // Replace the image at the given index
    banner.images[imageIndex] = image;
    await banner.save();
  
    res.status(200).json({ banner, status: 200 });
  });
  



exports.delete = asyncHandler(async (req, res) => {
  const { id, index } = req.params;

  const banner = await BannerModel.findById(id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }

  const imageIndex = parseInt(index);
  if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= banner.images.length) {
    return res.status(400).json({ message: 'Invalid image index' });
  }

  // Remove the image from the array
  banner.images.splice(imageIndex, 1);
  await banner.save();

  res.status(200).json({
    status: 200,
    message: 'Image deleted successfully',
    updatedImages: banner.images,
  });
});


//delete all banner
exports.deleteAll = asyncHandler(async (req, res) => {
    const banner = await BannerModel.deleteMany();
    res.status(200).json({banner,  status: 200 });
})
