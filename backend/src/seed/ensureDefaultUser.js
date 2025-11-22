const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const ensureDefaultUser = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found. Seeding default user...');

            // Check if avatar.webp exists in uploads
            const uploadDir = path.join(__dirname, '../uploads');
            const defaultImage = 'avatar.webp';
            const imagePath = path.join(uploadDir, defaultImage);
            let profilePicture = '';

            if (fs.existsSync(imagePath)) {
                const fileBuffer = fs.readFileSync(imagePath);
                const b64 = fileBuffer.toString('base64');
                // Assuming webp, but could be different. Hardcoding for the seed file.
                profilePicture = `data:image/webp;base64,${b64}`;
            } else {
                console.warn(`Warning: Default profile picture '${defaultImage}' not found in ${uploadDir}.`);
            }

            const defaultUser = {
                name: 'Solomon Belay',
                email: 'solomon.belay@gmail.com',
                interests: ['Coding', 'Docker', 'Photography'],
                profilePicture: profilePicture
            };

            await User.create(defaultUser);
            console.log('Default user created successfully.');
        } else {
            console.log('Users already exist. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding default user:', error);
        // We don't throw here to avoid crashing the server on startup if seeding fails,
        // but in a strict environment you might want to.
    }
};

module.exports = ensureDefaultUser;
