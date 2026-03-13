import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name:  { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [orderItemSchema],
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
}, {
    timestamps: true,
    versionKey: false
});

orderSchema.index({ user_id: 1 });
const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;