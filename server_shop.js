import { Shop } from "./database_shop.js";

function haversineDistance(coords1, coords2, isMiles = false) {
    const toRad = (x) => x * Math.PI / 180;

    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;

    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    if (isMiles) {
        distance /= 1.60934;
    }
    return distance;
}

function getShops(app) {
    app.get("/getShops", async (req, res) => {
        try {
            const shops = await Shop.find();
            res.send(shops);
            console.log(shops);
        } catch (err) {
            console.log("Error catched: Get shops fail.")
            console.log(err);
            res.status(500).send(err);
        }
    });
}

function latlngShop(app) {
    app.get("/latlngShop/:latitude/:longitude", async (req, res) => {
        try {
            const shops = await Shop.find();

            if (isNaN(req.params.latitude) || isNaN(req.params.longitude)) {
                res.status(400).send("Number is required");
                throw new Error("Number is required");
            }

            const coords1 = { latitude: req.params.latitude, longitude: req.params.longitude };
            let coords2 = { laitude: 34.022, longitude: -118.2437 };

            let jsonOBJ = shops.filter((shop) => {
            coords2 = { latitude: shop.latitude, longitude: shop.longitude };
            console.log(haversineDistance(coords1, coords2));
            return haversineDistance(coords1, coords2) <= 2;
            });

            if (jsonOBJ.length == 0) {
                res.send("Returned array is empty");
                throw new Error("Returned array is empty");
            } else {
                res.send(JSON.stringify(jsonOBJ));
                console.log(JSON.stringify(jsonOBJ));
            }
        } catch (err) {
            console.log("Error catched: Get shop fail.")
            console.log(err);
        }
    });
}

function createShop(app, authorize) {
    app.post("/createShop", authorize, async (req, res) => {
        try {
            let inputData = req.body;
            let shoparr = [];
            inputData.forEach((shop) => {
                let shopData = new Shop (shop);
                shopData.save();
                shoparr.push(shopData);
            });
            res.status(201).send(shoparr);
            console.log(shoparr);
        } catch (err) {
            res.status(400).json({ err: "Error catched: Add shops fail." });
            console.log("Error catched: Add shops fail.")
            console.log(err);
        }
    });
}

function editShop(app, authorize) {
    app.put("/editShop/:shopid", authorize, async (req, res) => {
        try {
            let inputData = req.body;
            let id = parseInt(req.params.shopid);

            if (!isNaN(id)) {
                const shop = await Shop.findOneAndUpdate({"shopid":id}, inputData);
                if (!shop) {
                    return res.status(404).end();
                }
                res.send(shop);
                console.log(shop);
            } else {
                throw new Error("Error catched: Edit shops fail. Number id is required");
            }
        } catch (err) {
            res.status(400).json({ "Error": "Error catched: Edit shops fail." });
            console.log("Error catched: Edit shops fail.")
            console.log(err);
        }
    });
}

function delShop(app, authorize) {
    app.delete("/delShop/:shopid", authorize, async (req, res) => {
        try {
            let id = parseInt(req.params.shopid);
            const shop = await Shop.deleteOne({"shopid": id});
            res.send(shop);
            console.log(shop);
        } catch (err) {
            console.log("Error catched: Delete shop fail.")
            console.log(err);
            res.status(500).send(err);
        }
    });
}

export { getShops, createShop, editShop, delShop, latlngShop, haversineDistance };