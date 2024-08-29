import { getShops } from "./fetch_data.js";
import { haversineDistance } from "./server_shop.js";

function printoutShops(shop, bot, fromId, resp) {
    shop.forEach((item) => {
        resp += `${item.shopid}\n`;
        resp += `${item.shopname}\n`;
        resp += `${item.address}\n`;
        resp += `${item.time}\n`;
        resp += `${item.latlng}\n`;
        console.log(resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

function start(bot){bot.onText(/\/start/,function (msg){
    let chatId=msg.chat.id;
    let resp="Welcome to PNS Chatbot.\nYou can access the PNS data from the following command.\n/getShops - Get all PNS shops' information.";
    bot.sendMessage(chatId,resp);

});}

function location(bot){bot.on("location", async (msg) => {
    try {
        let fromId = msg.from.id;
        let resp = "";
        const coords1 = { latitude: msg.location.latitude, longitude: msg.location.longitude };
        let coords2 = { laitude: 34.022, longitude: -118.2437 };
        
        let result = getShops.data.filter((shop) => {
            coords2 = { latitude: shop.latitude, longitude: shop.longitude };
            console.log(haversineDistance(coords1, coords2));
            return haversineDistance(coords1, coords2) <= 2;
        });
        if (result.length > 0) {
            printoutShops(result, bot, fromId, resp);
        } else {
            bot.sendMessage(fromId, "No nearby PNS shop.");
        }
    } catch (err) {
        console.log(err);
    }
});}

function getShops_telegram (bot){bot.onText(/\/getShops/,function(msg){
    let fromId = msg.from.id;
    let resp="";
    try{
        printoutShops(getShops.data,bot,fromId,resp);
    }catch(err){
        console.log(err);
    }
});}

export { printoutShops, haversineDistance, getShops, location, getShops_telegram, start };