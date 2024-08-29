import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productid: { type: Number, min: 0, max: 999999 },
    category: { type: String, required: true },
    productname_en: { type: String, required: true },
    brand: { type: String, required: true },
    productname_cn: { type: String, required: true },
    price: { type: Number, min: 0, max: 999999.99 },
    description: { type: String, required: true },
    barcode: {
        type: String,
        validate: {
            validator: function(val) {
                return val.length == 13;
            },
            message: props => `${props.value} is not a valid EAN13 Barcode number!`
        }
    },
});

export const Product = mongoose.model("wproduct", productSchema);

export async function addproductInDB(productObj) {
//2024-8-19  product remove 
    const product = new Product(productObj);
    return await product.save();
}

export async function getProductsInDB() {
    return await Product.find();

    
}

// Start  2024-8-21
export async function findproductByBarcodeInDB(keyword) {
    console.log("Calling findproductByBarcodeInDB!")
    return await Product.find( 
        {  barcode:  { $regex: keyword}}
    );
}
// End   2024-8-21

export async function editproductInDB(id, productObj) {
    if (!mongoose.isValidObjectId(id)) {
        throw Error("not valid Object ID!");
    }
    return await Product.findByIdAndUpdate(id, productObj, 
        { new: true, upsert: false})
}



export async function delproductInDB(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw Error("not valid Object ID!");
    }
    return Product.findByIdAndDelete(id);
}


