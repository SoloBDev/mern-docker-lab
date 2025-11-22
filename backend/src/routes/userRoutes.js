const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    getProfile,
    updateProfile,
    updateProfilePicture
} = require('../controllers/userController');

router.get('/get-profile', getProfile);
router.put('/update-profile', updateProfile);
router.put('/profile-picture', upload.single('image'), updateProfilePicture);

module.exports = router;