const Product = require('../models/Product');
const asyncWrapper = require('../utils/asyncWrapper');

// Add new product
const addProduct = asyncWrapper(async (req, res) => {
    const { name, price, stock, category } = req.body;
    const product = await Product.create({
        name,
        price,
        stock,
        category
    });

    res.status(201).json({
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

    res.status(200).json({
        success: true,
        message: "All products!",
        count: products.length,
        products,
    });
});


module.exports = {
    addProduct,
    viewProducts,
}