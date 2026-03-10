import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true // Remove leading and trailing whitespaces
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, { timestamps: true,
    versionKey: false
 });

const Product = mongoose.model("Product", productSchema);
export default Product
