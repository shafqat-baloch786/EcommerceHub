const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const mongoose = require('mongoose');


// Add to cart
const addToCart = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    // Validate product id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandlerClass("Invalid product id!", 400));
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandlerClass("Product not found!", 404));
    }

    // Optional: stock check
    if (product.stock < quantity) {
        return next(new ErrorHandlerClass("Not enough stock available!", 400));
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });

    // If cart does not exist, create new
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    product: product._id,
                    quantity,
                    price: product.price, // snapshot price
                },
            ],
        });

        return res.status(201).json({
            success: true,
            message: "Product added to cart!",
            cart,
        });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {

        // Update quantity if product already in cart
        cart.items[itemIndex].quantity += quantity;
    } else {
        
        // Add new product to cart
        cart.items.push({
            product: product._id,
            quantity,
            price: product.price,
        });
    }

    // Save cart (totals auto-calculated by pre-save hook)
    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Cart updated successfully!",
        cart,
    });
});


// Get cart items
const getCart = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

    // Check if cart is empty (no cart OR no items)
    if (!cart || cart.items.length === 0) {
        return res.status(200).json({
            success: true,
            message: "Cart is empty",
            cart: {
                items: [],
            },
        });
    }

    // Else return success response
    return res.status(200).json({
        success: true,
        cart,
    });
});


// Update cart items
const updateCartItem = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandlerClass("Invalid product id!", 400));
    }

    // Validate quantity
    if (quantity < 0) {
        return next(new ErrorHandlerClass("Quantity cannot be negative!", 400));
    }

    // Find product in DB to check stock
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandlerClass("Product not found!", 404));
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return next(new ErrorHandlerClass("Cart not found!", 404));
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return next(new ErrorHandlerClass("Product not in cart!", 404));
    }

    // If quantity is 0 → remove item
    if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        // Check stock before updating
        if (quantity > product.stock) {
            return next(new ErrorHandlerClass("Not enough stock available!", 400));
        }

        // Update quantity
        cart.items[itemIndex].quantity = quantity;
    }

    // Save cart (totals auto-calculated by pre-save hook)
    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Cart updated successfully!",
        cart,
    });
});


// Remove items from cart
const removeCartItem = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandlerClass("Invalid product id!", 400));
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return next(new ErrorHandlerClass("Cart not found!", 404));
    }

    // Remove product from cart items
    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    // Save cart (totals auto-calculated by pre-save hook)
    await cart.save();

    // Return success response
    return res.status(200).json({
        success: true,
        message: "Item removed from cart!",
        cart,
    });
});

// Clear cart
const clearCart = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return next(new ErrorHandlerClass("Cart not found!", 404));
    }

    // Remove all items from cart
    cart.items = [];

    // Save cart (totals auto-calculated by pre-save hook)
    await cart.save();

    // Return success response
    return res.status(200).json({
        success: true,
        message: "Cart cleared successfully!",
        cart,
    });
});




module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
}
