const asyncWrapper = require('../utils/asyncWrapper');
const Category = require('../models/Category');
const ErrorHandlerClass = require('../utils//ErrorHandlerClass');
const slugify = require('slugify');
const mongoose = require('mongoose');

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


// View sinlge category
const viewCategory = asyncWrapper(async (req, res, next) => {
    const categoryId = req.params.id;

    // Check if id in params is valid
    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        return next (new ErrorHandlerClass("Invalid id!", 400));
    }

    // Else find that category by id
    const category = await Category.findById( categoryId );

    // If no category found
    if(!category) {
        return next(new ErrorHandlerClass("Category not found!", 404));
    }

    // Else success response
    return res.status(200).json({
        success: true,
        message: "Category found!",
        category
    });

});


// Edit/update category
const updateCategory = asyncWrapper(async (req, res, next) => {
    const { name, description, parentCategory } = req.body;
    const categoryId = req.params.id;

    // Check if id in params is valid
    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        return next (new ErrorHandlerClass("Invalid id!", 400));
    } 

    // Empty object to store updated data
    const updates = {};
    if(name) updates.name = name
    if(description) updates.description = description
    if(parentCategory) updates.parentCategory = parentCategory
    
    // Updated category 
    const updatedData = await Category.findByIdAndUpdate(categoryId, updates, {
        new: true,
        runValidators: true,
        context: 'query'
    }).select('name description parentCategory');

    // Success response
    return res.status(200).json({
        success: true,
        message: "Category updated successfully!"
    })
});



module.exports = {
    addCategory,
    getCategories,
    viewCategory,
    updateCategory,
}