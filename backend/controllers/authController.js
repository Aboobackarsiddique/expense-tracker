const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Generate JWT Token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1h'});
};
// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageURL } = req.body;
// Validation check
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user =  await User.create({ fullName, email, password, profileImageURL });
                res.status(201).json({
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profileImageURL: user.profileImageURL,
                    },
                    token: generateToken(user._id),
                });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error : error.message });
    } 
}
// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImageURL: user.profileImageURL,
                },
                token: generateToken(user._id),
            });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}
// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error getting user info', error: error.message });
    }

}
