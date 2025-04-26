const UserModel = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


//create user
exports.create = asyncHandler(async (req, res) => {
    const { name, email, password, district, standerd } = req.body;
    
    const image = req.file.filename;
    if (!name || !email || !password  ||  !district || !standerd ) {
      return res.status(400).json({ message: "Please add all fields" });
    }
  
// Check  email or phone already exists
    const userExists = await UserModel.findOne({ 
      $or: [{ email: email }] 
    });
  
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

     const  role = 'user'
      const user = await UserModel.create({
      name,
      email,
      password,
      role,
      district,
      standerd,
      image
    });
  
    if (user) {
      return res.status(201).json({ message: "User created" });
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  });


  exports.login = asyncHandler(async (req, res) => {
    
    
    try {
      const { email, password } = req.body; // Include fcmToken in request body
      console.log(req.body);
      const user = await UserModel.findOne( email );

      console.log(user, "use");
      
  
        if (!user) {
            return res.status(400).json({ invalid: true, message: "Invalid email or password" });
        }
  
        // if (user.blocked) {
        //     return res.status(403).json({ message: "Your account is blocked" }); 
        // }
  
        const isPasswordMatch = await bcrypt.compare(password, user.password);
  
        if (isPasswordMatch) {
            const token = jwt.sign({ email: user.email, id: user._id }, "myjwtsecretkey", { expiresIn: "1h" });
  
  
            await user.save(); 
  
            const userDetails = {
                name: user.name,
                email: user.email,
                _id: user._id,
                role: user.role,
                phone: user.phone,
                image: user.image,
                district: user.district,
                standerd: user.standerd
            };
  
            return res.status(200).json({ token, userDetails });
        } else {
            return res.status(400).json({ invalid: true, message: "Invalid email or password" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Server error, please try again" });
    }
  });


// get all 
exports.getAll = asyncHandler(async (req, res) => {
    const user = await UserModel.find();
    res.status(200).json(user);
})

//get by Id
exports.get = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json(user);
})

//delete admin
exports.delete = asyncHandler(async (req, res) => {
     await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "User deleted"});
})
