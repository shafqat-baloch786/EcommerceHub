const mongoose = require('mongoose');

// Category schema
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            tirm: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;