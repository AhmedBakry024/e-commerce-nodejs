import AppErrors from "../Utils/appErrors.js";
import Order from "../Models/order.model.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
export const createOrder = async ({ userId, orderItems, payment_method, payment_status, currency, total_price, voucher }) => {
    try {
        await Order.create({ user_id: userId,
            products: orderItems,
            payment_method,
            payment_status,
            currency,
            total_price,
            voucher
        });
    } catch (error) {
        throw new AppErrors(error.message, 500);
    }
}

export const getMyOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user_id: req.user.id });
    res.status(200).json({ success: true, data: orders });
})