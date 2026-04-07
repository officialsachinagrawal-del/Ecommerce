const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/senEmail')
const generateTokenAndSetCookie = require('../utils/jwtToken');
const userPng =
  "https://dummyimage.com/150x150/667eea/ffffff&text=User"; //default profile pic for the user

  const cloudinary = require('cloudinary');



// Create New user or Signup
exports.createNewUser= async(req,res)=>{
  try {
    console.log('===== SIGNUP REQUEST DEBUG =====');
    console.log('req.body:', JSON.stringify(req.body));
    console.log('req.fields:', req.fields);
    console.log('req.files:', req.files);
    console.log('Content-Type:', req.get('content-type'));
    console.log('req.headers keys:', Object.keys(req.headers));
    console.log('==============================');
    
    // Try to get data from different places
    const bodyData = req.body || {};
    const fieldsData = req.fields || {};
    
    const name = bodyData.name || fieldsData.name;
    const email = bodyData.email || fieldsData.email;
    const password = bodyData.password || fieldsData.password;
    
    console.log('Extracted - name:', name, 'email:', email, 'password:', password);

    // Validate name, email & password
    if(!name || !email || !password) {
      console.log('Missing fields validation failed');
      return res.status(400).json({error:"Please fill all the inputs..."});
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if(password.length < 8) {
      return res.status(400).json({error: "Password Should be 8 character long"});
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({error:"Account already exist"});
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle avatar upload
    let avatarData = {
      public_id: "default-avatar",
      url: userPng
    };

    // Try to upload avatar if provided and Cloudinary is configured
    if(req.body.avatar && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale"
        });
        avatarData = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        };
      } catch(uploadErr) {
        console.log('Avatar upload failed, using default:', uploadErr.message);
        // Continue with default avatar if upload fails
      }
    }

    // Create New User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatarData
    });

    await user.save();

    // Generate a JWT token and send response
    return generateTokenAndSetCookie(res, user);

  } catch(err) {
    console.log(err);
    res.status(500).json({error: "Server error"})
  }
}



// Login User 
exports.loginUser = async(req,res)=>{
    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password)
    {
      return res.status(400).json({error:"Please fill all the inputs..."});
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    try{

      // Find the user with the given email
    const user = await User.findOne({ email }).select("+password");

    if(!user)
    return res.status(400).json({error:"Invalid credentials"})

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
    return res.status(400).json({error:"Invalid Password"})


  
  
     // Generate a JWT token and store it in a cookie with a two-day expiration time
      
      generateTokenAndSetCookie(res, user);
 
  
   
    }

    catch(err){
     console.log(err);
      res.status(500).json("Server error")
    }
  }

// Logout
exports.logout = (req, res) => {
  
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out' });


};

// Forgot Password

exports.forgotPassword = async (req, res, next) => {
  // Get the user's email from the request body
  const { email } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token and save it to the user's account
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save();

    // Send an email to the user with the reset link
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/password/reset/${token}`;

    const message = `You are receiving this email because you  have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message,
      });

      return res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Function to get a single user by ID
exports.getUserDetails = async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id).select('-password'); // select all user fields except the password field

  

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    res.json({success:true,user});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Update User Profile 

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name !== '') {
      user.name = req.body.name;
    }

    if (req.body.email !== '') {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Account already exist' });
      }

      user.email = req.body.email;
    }

    const avatarData = req.body.avatar;

    if (typeof avatarData === 'string' && avatarData.trim() !== '') {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        const imageId = user.avatar?.public_id;

        if (imageId && imageId !== 'default-avatar' && imageId !== 'local-avatar') {
          await cloudinary.v2.uploader.destroy(imageId);
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatarData, {
          folder: 'avatars',
          width: 150,
          crop: 'scale',
        });

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        user.avatar = {
          public_id: 'local-avatar',
          url: avatarData,
        };
      }
    }
   

  
    const updatedUser = await user.save();

    res.json({success:true,updatedUser});
  } catch (error) {
    console.error('updateUserProfile error:', error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Account already exist' });
    }
    return res.status(500).json({ message: error.message });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {

  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


// Update User role

exports.updateUserRole = async (req, res) => {

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = req.body.role;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

    


