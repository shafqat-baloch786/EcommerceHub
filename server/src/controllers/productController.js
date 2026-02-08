const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');

// Add new product
const addProduct = asyncWrapper(async (req, res) => {
    const { name, price, stock, category } = req.body;
    const product = await Product.create({
        name,
        price,
        stock,
        category
    });

    // Success response
    return res.status(201).json({
        success: true,
        message: "Product created successfully!",
        product,
    })
});


// View all products
const viewProducts = asyncWrapper(async (req, res) => {
    const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .populate('category', 'name');

    // Success response
    return res.status(200).json({
        success: true,
        message: "All products!",
        count: products.length,
        products,
    });
});


// View single product
const viewProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // If product not found
    if (!product) {
        return next(new ErrorHandlerClass("Product not found!", 404));
    }

    // Else success response
    return res.status(200).json({
        success: true,
        message: "Product found!",
        product,
    })

});


// Edit/Update product
const updateProduct = asyncWrapper(async (req, res, next) => {

    // Get data from request body and productId from params
    const { name, price, stock, category } = req.body;
    const productId = req.params.id;

    // Check if product id is not valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler("Invalid product id!", 400));
    }

    // Adding data into udpates object
    const updates = {};
    if (name) updates.name = name
    if (price) updates.price = price
    if (stock) updates.stock = stock
    if (category) updates.category = category

    const newProduct = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
        context: 'query'
    });

    // If product not found
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    // Success response
    return res.status(200).json({
        success: true,
        message: "Product updated successfully!"
    });

});

// Delete product
const deleteProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.id;

    // Check if id in params is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandlerClass("Invalid id!", 400));
    }

    // Delete product
    await Product.findByIdAndDelete(productId);

    // Success response
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully!"
    });
});



module.exports = {
    addProduct,
    viewProducts,
    viewProduct,
    updateProduct,
    deleteProduct,
}