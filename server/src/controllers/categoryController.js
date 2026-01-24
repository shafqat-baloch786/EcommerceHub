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

// View all categories
const getCategories = asyncWrapper(async (req, res, next) => {
    const categories = await Category.find({ isActive: true })
    .select('name description parentCategory createdAt updatedAt')
    .sort({ sortOrder: 1 });

    // If no categoires found
    if(categories.length === 0) {
        return next(new ErrorHandlerClass("No categories found!", 404));
    }
    
    // Else success
    return res.status(200).json({
        success: true,
        message: "All categories!",
        categories
    })
});

module.exports = {
    addCategory,
    getCategories,
}