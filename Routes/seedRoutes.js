import express from "express";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";
import data from "../data.js"

export const seedRouter = express.Router();

seedRouter.get("/", async (req, res,next) => {
    try{
        await Product.deleteMany({}); //delete by filtering
        await User.deleteMany({}); //delete by filtering
        await Order.deleteMany({}); //delete by filtering
        const createdProducts = await Product.insertMany(data.products);
        const createdUsers = await User.insertMany(data.users);

        res.send({createdProducts, createdUsers});
    }
    catch(e)
    {
        console.log("failed to update " +e.message);
    }
})

