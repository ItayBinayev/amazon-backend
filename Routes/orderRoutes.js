import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { isAuth } from "../utilles.js";


export const orderRouter = express.Router();

orderRouter.get(
    "/:id",
    isAuth,
    expressAsyncHandler(async (req, res) => {  
        console.log("in endpoint orderID")
        const { id } = req.params;
        console.log(id)
        const order = await Order.findById(id);
        if(order)
        {
            res.send(order);
        }
        res.status(404).send({message: "Order Not Found"});
    }
))

orderRouter.post(
    "/",
    isAuth,
    expressAsyncHandler(async (req, res) => {  
        try{
        const newOrder = new Order({
            orderItems: req.body.orderItems.map(item=>({
                ...item,
                product: item._id})),
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id,
            });
            const order = await newOrder.save();
            res.status(201).send({message: "New Order Created" , order});
        }
        catch(e){
            res.status(500).send({message: "Error! Order didnt create!"});
        }
    }
))



