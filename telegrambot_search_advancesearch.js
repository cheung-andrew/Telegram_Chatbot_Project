import { searchproduct, advancesearchproduct } from "./fetch_data.js";

export async function printoutProduct(products, bot, fromId) {
    products.forEach(async (item) => {
        let resp = "";
        resp += `Product Name in English: ${item.productname_en}\n`;
        resp += `Product Name in Chinese: ${item.productname_cn}\n`;
        resp += `Category: ${item.category}\n`;
        resp += `Brand: ${item.brand}\n`;
        resp += `Price: $${item.price}\n`;
        resp += `Description: ${item.description}\n`;
        resp += `Barcode: ${item.barcode}\n`;
        console.log(resp);
        bot.sendMessage(fromId, resp);
    });
};

export async function botOnSearchOnly(bot) {
    bot.onText(/\/search/, function (msg) {
        let chatId = msg.chat.id;
        let resp = "/search <keyword> - Please type in the product name keyword to start the Search.";
        if (msg.text === "/search") {
            bot.sendMessage(chatId, resp);
        }
    });
};

export async function botOnSearchKeyword(bot) {
    bot.onText(/\/search (.+)/, async function (msg, match) {
        try {
            let chatId = msg.chat.id;
            let input = match[1];
            let res = await searchproduct(input);
            console.log(res.status); // for debugging
            if (res.data.length > 0) {
                printoutProduct(res.data, bot, chatId);
            } else {
                bot.sendMessage(chatId, res.data.message);
            }
        } catch (err) {
            console.error("Error in botOnSearchKeyword:", err);
            bot.sendMessage(chatId, "An error occurred while processing your request.");
        }
    });
};

export async function botOnAdvanceSearchOnly(bot) {
    bot.onText(/\/advancesearch/, function (msg) {
        let chatId = msg.chat.id;
        let resp = "/advancesearch <keyword>&<price range> - Please type in the product name keyword and price range to start the Search.";
        if (msg.text === "/advancesearch") {
            bot.sendMessage(chatId, resp);
        }
    });
};

export async function botOnAdvanceSearchKeyword(bot) {
    bot.onText(/\/advancesearch (.+)/, async function (msg, match) {
        let chatId = msg.from.id;
        try {
            let chatId = msg.from.id;
            let resp = "";
            let input = match[1];
            let inputParts = input.split("&");

            // Check if the input has both keyword and price range
            if (inputParts.length < 2) {
                let message = "Please provide both a keyword and a price range separated by '&'. For example: \'/advancesearch cleaner&10-30\'";
                console.log(message);
                bot.sendMessage(chatId, message);
                return;
            }

            // Extract the keyword and price range from the input
            let keyword = inputParts[0].trim();
            let priceRange = inputParts[1].trim();

            // Validate the price range format
            if (!priceRange.match(/^\d+\-\d+$/)) {
                let message = "Please provide the price range in the correct format (e.g., 10-30)";
                console.log(message);
                bot.sendMessage(chatId, message);
                return;
            }
            let res = await advancesearchproduct(input);
            console.log(res.status); // for debugging
            if (res.data.length > 0) {
                printoutProduct(res.data, bot, chatId);
            } else {
                bot.sendMessage(chatId, res.data.message);
            }
        } catch (err) {
            console.error("Error in botOnSearchKeyword:", err);
            bot.sendMessage(chatId, "An error occurred while processing your request.");
        }
    });
};