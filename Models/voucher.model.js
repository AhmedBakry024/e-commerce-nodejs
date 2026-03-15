import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please type your voucher code!"],
        unique: true
    },
    discount_percentage: {
        type: Number,
        required: [true, "Please type your discount percentage!"],
        min: 0,
        max: 100
    },
    expiration_date: {
        type: Date,
        required: [true, "Please type your voucher expiration date!"]
    },
    applied_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true, versionKey: false });

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
