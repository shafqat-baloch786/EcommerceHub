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
    const product = await Product.findById( productId );

    // If product not found
    if(!product) {
        return next(new ErrorHandlerClass("Product not found!", 404));
    }

    // Else success response
    return res.status(200).json({
        success: true,
        message: "Product found!",
        product,
    })

});


module.exports = {
    addProduct,
    viewProducts,
    viewProduct,
}