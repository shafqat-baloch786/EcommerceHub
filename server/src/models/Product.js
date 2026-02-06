const mongoose = require('mongoose');


// Product schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category'
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
)


// Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;