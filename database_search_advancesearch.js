import { Product } from './database_product.js';

export async function findProductByKeywordInDB(keyword) {
    return await Product.find(
        {
            $or: [
                { productname_en: { $regex: keyword, $options: 'i' } },
                { productname_cn: { $regex: keyword, $options: 'i' } }
            ]
        });
}

export async function findProductByKeywordPriceInDB(inputProductKeyword, minPrice, maxPrice) {
    return await Product.find({
        $and: [{
            $or: [{ productname_en: { $regex: inputProductKeyword, $options: 'i' } },
            { productname_cn: { $regex: inputProductKeyword, $options: 'i' } }]
        }, { price: { $gte: minPrice, $lte: maxPrice } }]
    });
}