import TelegramBot from "node-telegram-bot-api";
import { getquestions, getProducts, getShops } from "./fetch_data.js";
import { botOnQuestionOnly, botOnQuestionKeyword } from "./telegrambot_questions.js";
import {
    botOnSearchOnly, botOnSearchKeyword,
    botOnAdvanceSearchOnly, botOnAdvanceSearchKeyword
} from "./telegrambot_search_advancesearch.js";
import { start, location, getShops_telegram} from "./telegrambot_shop.js";
// Add TelegramBOT message for /product 2024-8-26
import {botOnProductOnly, botOnProductBarcode } from "./telegrambot_product.js";

console.log("Telegram Bot Server start...");
// let token = ""; //group
let token = ""; //

let bot = new TelegramBot(token, { polling: true });


// To Change
bot.onText(/\/start/, async function (msg) {
    let chatId = msg.chat.id;
    let resp =
        `Telegram Bot.
/search <name keyword> - search products via keywords
/advancesearch <product name keyword> <price range> - search products via keywords and price range
/product <barcode> - get product info via barcode
share location - get shops within 2 km
/question <Q&A keywords> - Search questions using keywords`;
    bot.sendMessage(chatId, resp);
});

// Question
botOnQuestionOnly(bot);
botOnQuestionKeyword(bot);

// : Product Barcode 
// Add TelegramBOT message for /product 2024-8-26
botOnProductOnly(bot);
botOnProductBarcode(bot);

// Start of  program 2024-8-22
botOnSearchOnly(bot);
botOnSearchKeyword(bot);
botOnAdvanceSearchOnly(bot);
botOnAdvanceSearchKeyword(bot);
// End of  program 2024-8-22


// 
//start(bot);
location(bot);
getShops_telegram(bot);
