import express from "express";
import expressAsyncHandler from "express-async-handler";

import Product from "../models/ProductModel.js";

export const productRouter = express.Router();
const PAGE_SIZE = 6;

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    res.send(products);
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get(
  "/token/:token",
  expressAsyncHandler(async (req, res) => {
    const { token } = req.params;
    const product = await Product.findOne({ token });
    product
      ? res.send(product)
      : res.status(404).send({ message: "Product not found" });
  })
);

productRouter.get(
  "/id/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const product = await Product.findById(id);
    console.log(product);
    product
      ? res.send(product)
      : res.status(404).send({ message: "Product not found" });
  })
);

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchquery = query.query || "";

    const queryfilter =
      searchquery && searchquery !== "all"
        ? { title: { $regex: searchquery, $options: "i" } }
        : {};
    const categoryfilter =
      category && category !== "all"
        ? { category }
        : {};
    const ratingfilter =
      rating && rating !== "all"
        ? { "rating.rate": { $gte: Number(rating) } }
        : {};
    const pricefilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortorder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
        ...queryfilter,
        ...categoryfilter,
        ...ratingfilter,
        ...pricefilter,
    
    }).sort(sortorder).skip((page - 1) * pageSize).limit(pageSize);
    const countproducts = await Product.countDocuments({
      ...queryfilter,
      ...categoryfilter,
      ...ratingfilter,
      ...pricefilter,
    });
    console.log(countproducts);
    res.send({products,page,countproducts,pages:Math.ceil(countproducts/pageSize)});
  })
);
