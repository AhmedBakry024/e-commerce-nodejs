import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [orderItemSchema],
    total_price: {
        type: Number,
        min: 0
    },
    payment_method: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

orderSchema.pre("save", function () {
    this.total_price = this.products.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );
});

const Order = mongoose.model("Order", orderSchema);
export default Order;