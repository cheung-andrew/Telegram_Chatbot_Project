import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    shopid: { type: Number, required:true },
    shopname: { type: String },
    address: { type: String },
    time: { type: String },
    latlng: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
});

const Shop = mongoose.model("Shop", shopSchema, "wshop");

export { Shop }