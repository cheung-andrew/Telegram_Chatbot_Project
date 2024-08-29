import { promises as fs, readFile } from "fs";
// 2024-8-21 lambo Barcode
import { getProductsInDB, findproductByBarcodeInDB, addproductInDB, delproductInDB, editproductInDB } from "./database.js";
//import { getProductsInDB, findproductByBarcodeInDB, addproductInDB, delproductInDB, editproductInDB } from "./database.js";

//import { readProductJSONfile, writeProductJSONfile  } from './product_utility.js'

export function addproduct(app, authorize) {

    app.post("/addproduct", authorize, async (req, res) => {
        // Start 2024-08-19 Mongodb  
        const productToCreate = req.body;
        // 2024-8-19  Product
        await addproductInDB(productToCreate).
            then(product => {
                console.log("Product Created:", product);
                res.status(201).send(JSON.stringify(product));
            })
            .catch(error => {
                res.status(440).json({ err: "Error caught: Create product fail. lambo" });
                console.error("Error creating product:", error)
            });
    });
};



async function readProductJSONfile() {
    return await fs.readFile("./productfile.json", "utf8");
}

async function writeProductJSONfile(data) {
    return await fs.writeFile("./productfile.json", data);
}


export function getproducts(app) {
    app.get("/getProducts", async (req, res) => {
        // Start 2024-08-19 Mongodb  
        await getProductsInDB()
            .then(product => {
                console.log(product);
                res.end(JSON.stringify(product));
            })
            .catch(error => {
                console.log("Error caught: Get product fail");
                console.log(error);

            });

    });
}



// Start 2024-08-21 Mongodb  
export function getproductWithBarcode(app) {
    // Start 2024-08-23 change http path  
    app.get("/getProductBarcode/:productid", async (req, res) => {
        // End 2024-08-21 Mongodb 
        try {
            const keyword = req.params.productid;
            const product = await findproductByBarcodeInDB(keyword);
            console.log(product);
            res.end(JSON.stringify(product));

        } catch (err) {
            console.log("Error caught: Search product fail");
            console.log(err);
        }
    });
}
// End 2024-08-21 Mongodb 



export function editproduct(app, authorize) {
    app.put("/editproduct/:productid", authorize, async (req, res) => {
        const id = req.params.productid;
        const productToEdit = req.body;
        await editproductInDB(id, productToEdit)
            .then(product => {
                if (!product) return res.status(404).send();
                console.log(product);
                res.status(201).send(JSON.stringify(product));
            })
            .catch(error => {
                console.error("Error finding user:", error);
                return res.status(404).send(error.message);
            })
    });
};



export function delproduct(app, authorize) {
    app.delete("/delproduct/:productid", authorize, async (req, res) => {
        let id = req.params.productid;
        delproductInDB(id)
            .then(product => {
                if (!product) return res.status(404).send();
                console.log("Product Deleted:", product);
                res.end(JSON.stringify(product));
            })
            .catch(error => {
                console.error("Error deleting product:", error);
                return res.status(404).send(error.message);
            })
    });
};    
