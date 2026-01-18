const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const generateToken = require('../utils/generateToken');

// User registration/signup
const register = asyncWrapper (async (req, res, next) => {
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
    const token = generateToken(user.id);

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





module.exports = {
    register
}