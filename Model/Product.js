const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    ProductID: Number,
    ProductName: String,
    Material: String
}, {collection: 'Products'});

const Product = mongoose.model("Proucts",productSchema);
module.exports = Product;