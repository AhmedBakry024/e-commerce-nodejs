import AppErrors from "../Utils/appErrors.js";
import Order from "../Models/order.model.js";
export const createOrder = async ({ userId, orderItems, payment_method, payment_status, currency }) => {
    try {
        await Order.create({ user_id: userId,
            products: orderItems,
            payment_method,
            payment_status,
            currency
        });
    } catch (error) {
        throw new AppErrors(error.message, 500);
    }
}