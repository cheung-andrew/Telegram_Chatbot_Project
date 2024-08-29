import axios from "axios";
import { promises as fs } from "fs";

// 
let getquestions = await axios.get("http://localhost:8080/getquestions");

async function searchquestions(keyword) {
    return await axios.get(`http://localhost:8080/question/${keyword}`);
}

// 
const url = "http://localhost:8080/getProducts";
let getProducts = await axios.get(url);

// Start  2024-08-21
// Start  2024-08-23
async function getproductWithBarcode(keyword) {
    return await axios.get(`http://localhost:8080/getProductBarcode/${keyword}`);
}
// End  2024-08-23
// End  2024-08-21

// 
const shops_url = "http://localhost:8080/getshops";
let getShops = await axios.get(shops_url);

//  2024-08-22
async function searchproduct(keyword) {
    return await axios.get(`http://localhost:8080/search/${keyword}`);
}

async function advancesearchproduct(keyword) {
    return await axios.get(`http://localhost:8080/advancesearch/${keyword}`);
}

export {
// Start  2024-08-21
getproductWithBarcode,
// End  2024-08-21
getquestions, getProducts, getShops,
    searchquestions, searchproduct, advancesearchproduct
};