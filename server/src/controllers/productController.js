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
    if (!product) {
        return next(new ErroHandlerClass("Product data not found in body request!", 404));
    }
    res.status(201).json({
        success: true,
        message: "Product created successfully!",
        product,
    })
});


module.exports = {
    addProduct,
}