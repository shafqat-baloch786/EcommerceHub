const asyncWrapper = require('../utils/asyncWrapper');
const Category = require('../models/Category');
const ErrorHandlerClass = require('../utils//ErrorHandlerClass');
const slugify = require('slugify');

// Add new catgories to system
const addCategory = asyncWrapper(async (req, res, next) => {
    const { name, description, parentCategory } = req.body;
    const exists = await Category.findOne({ name });

    // Check if category already exists in database
    if(exists) {
        return next (new ErrorHandlerClass(`${exists.name} already exists!`, 400));
    }

    // Else create new one with that name
    const category = await Category.create({
        name,
        slug: slugify(name, { lower: true }),
        description,
        parentCategory,
    });

    // Return success response
    return res.status(201).json({
        success: true,
        message: "Category addedd successfuly!",
        category,
    })
});



module.exports = {
    addCategory,
}