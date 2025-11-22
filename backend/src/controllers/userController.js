const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

// Get user profile
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne({});
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    res.json(user);
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const { name, email, interests } = req.body;
    
    // Basic validation
    if (!name || !email) {
        throw new ApiError(400, 'Name and email are required');
    }

    const user = await User.findOneAndUpdate(
        {},
        { 
            name, 
            email, 
            interests: interests ? interests.split(',').map(i => i.trim()) : [] 
        },
        { new: true, upsert: true, runValidators: true }
    );
    res.json(user);
});

// Update profile picture
exports.updateProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const mimeType = req.file.mimetype;
    const imageString = `data:${mimeType};base64,${b64}`;

    const user = await User.findOneAndUpdate(
        {},
        { profilePicture: imageString },
        { new: true, upsert: true }
    );
    res.json(user);
});