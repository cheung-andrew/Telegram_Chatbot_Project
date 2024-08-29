import { getProducts, getproductWithBarcode } from "./fetch_data.js";

// Add TelegramBOT message for /product 2024-8-26
function botOnProductOnly(bot) {
    bot.onText(/\/product/, function (msg) {
        let chatId = msg.chat.id;
        let resp = "/product <barcode> - Please type in the barcode to start the Search.";
        if (msg.text === "/product") {
            bot.sendMessage(chatId, resp);
        }
    });
}

// Product Barcode 
function botOnProductBarcode(bot) {
    bot.onText(/\/product (.+)/, async function (msg, match) {
        try {
            let fromId = msg.from.id;
            let resp = "";
            let input = match[1];
            let result = (await getproductWithBarcode(input)).data;
            if (result.length != 0) {
                printoutBarcode(result, bot, fromId, resp);
            }
            else {
                let message = "No result found. Try other keywords for query.";
                console.log(message);
                bot.sendMessage(fromId, message);
            }
        } catch (err) {
            console.log(err);
        }
    });
}


function printoutBarcode(barcode_res, bot, fromId, resp) {

    barcode_res.forEach((item) => {
        resp += `Product number : ${item.productid}\n`;
        resp += `Category : ${item.category}\n`;
        resp += `Name : ${item.productname_en}\n`;
        resp += `中文名稱 : ${item.productname_cn}\n`;
        resp += `Brand: ${item.brand} \n`;
        resp += `Price: ${item.price} \n`;
        resp += `Barcode: ${item.barcode} \n`;
        resp += `Description : ${item.description}`;

        console.log(resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

export {botOnProductOnly, botOnProductBarcode }