// Start of import statements 2024-8-13
import express, { json } from "express";
import { promises as fs, readFile } from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// start for shop program
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getShops, createShop, editShop, delShop, latlngShop } from "./server_shop.js";
// Start for Product  2024-8-21
import { addproduct, editproduct , getproducts, delproduct, getproductWithBarcode } from './server_product.js'
// End for Product  2024-8-21
import { getQuestions, getQuestionWithKeyword, createQuestion, editQuestion, delQuestion } from "./server_questions.js";
// Start for Search  2024-8-22
import { getProductWithKeyword, getProductWithKeywordPrice } from "./server_search_advancesearch.js";
// End for Search  2024-8-22

// mongoose import 2024-8-16
import { connectDB, disconnectDB } from "./database.js";
// End of import statements 2024-8-13

// Start of initialization 2024-8-13

// TODO main();

// calling mongoose connectDB 2024-8-16
await connectDB();

const users = [{ "id": "1", "username": "user1", "password": "$2b$10$mim5bK.8vWt.9bau06G6LuTIAb27NjmhlWXrocdyzXMs00chVq3Vi" }, //password123
{ "id": "2", "username": "user2", "password": "$2a$12$EdTgRDBvgaL7vBP04kCF7.HXi/JTpdCvH5sG3dqDlwjorQY.sSH9e" }]; //Passw0rd

const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.user = {
            "id": user.id,
            "username": user.username
        };
        next();
    } else {
        res.status(401).json({
            "message": "Invalid credentials"
        });
    }
};

const authorize = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader === undefined || authHeader === null) {
            return res.sendStatus(401);
        }
        const token = authHeader.split(" ")[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, "secret_key", (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } catch (err) {
        console.log(err);
    }
};

let app = express();
app.use(express.json());
app.use((err, _, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON input" })
    };
    next(err);
});
// End of of initialization 2024-8-13

// Start of Question  program 2024-8-13
getQuestionWithKeyword(app);
getQuestions(app);
createQuestion(app, authorize);
editQuestion(app, authorize);
delQuestion(app, authorize);
// End  of Question  program 2024-8-13

// Start of Product program 2024-8-13
delproduct(app, authorize);
addproduct(app, authorize);
editproduct(app, authorize);
getproducts(app);
// Start for Product  2024-8-21
getproductWithBarcode(app);
// End  of Product program 2024-8-21

// End  of Product program 2024-8-13

// Start of Search program 2024-8-22
getProductWithKeyword(app);
getProductWithKeywordPrice(app);
// End of Search program 2024-8-22

// Start  of shop program 2024-8-13
getShops(app);
createShop(app, authorize);
editShop(app, authorize);
delShop(app, authorize);
latlngShop(app);
// End of shop program 2024-8-13

// Multer file upload
const PORT = 8080;
const _filname = fileURLToPath(import.meta.url); //get the resolved path to file
const _dirname = path.dirname(_filname); //get the name of the directory

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single("file");

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
}

app.use("/uploads", express.static(path.join(_dirname, "uploads")));

app.post("/upload", authorize, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ msg: "Error: No File Selected!" });
        }
        res.status(200).json({
            msg: "File Uploaded!",
            fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
        });
    });
});


// Start of common program 2024-8-9
app.post("/login", authenticate, (req, res) => {
    const token = jwt.sign(req.user, "secret_key", { "expiresIn": "999h" });
    res.json({ token });
});

app.get("/protected", authorize, (req, res) => {
    res.json({ "message": "This is a protected route" });
});

let server = app.listen(8080, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Please visit the website http://${host}:${port}`);
});
// End of common program 2024-8-9
