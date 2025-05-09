import express from 'express';
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay } from '../controllers/order.controller.js';
import adminAuth from '../middleware/admin.auth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list',adminAuth ,allOrders);
orderRouter.post('/status', adminAuth, updateStatus);


orderRouter.post('/place',authUser ,placeOrder);
orderRouter.post('/stripe',authUser ,placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);


orderRouter.post('/userorders', authUser, userOrders);

//verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);


export default orderRouter;