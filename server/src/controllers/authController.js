const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const generateToken = require('../utils/generateToken');

// User registration/signup
const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandlerClass('User already exists', 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    // Genereate json web token and add to response
    const token = generateToken(user._id);

    return res.status(201).json({
        success: true,
        message: "User created successfuly",
        token,
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    });

});


// User login/sign in
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // If user does not exist in db with this email
    if (!user) {
        return next(new ErrorHandlerClass("User not found!", 404));
    }

    // If enterd password does not match with saved one
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandlerClass("Email or password invalid!", 400));
    }

    const token = generateToken(user._id);

    // Success response
    return res.status(200).json({
        success: true,
        messag: "User logged in successfully!",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    })
});

// Current user profile
const me = asyncWrapper(async (req, res, next) => {
    return res.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
    })
});

// Edit current user profile
const editMe = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const { name, email, avatar } = req.body;

    const updates = {};
    if (name) {
        updates.name = name
    }
    if (email) {
        updates.email = email
    }
    if (avatar) {
        updates.avatar = avatar
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
        context: 'query'
    }).select('_id name email avatar role')

    return res.status(200).json({
        success: true,
        message: "User updated successfuly!",
        user: updatedUser
    })
})


module.exports = {
    register,
    login,
    me,
    editMe
}