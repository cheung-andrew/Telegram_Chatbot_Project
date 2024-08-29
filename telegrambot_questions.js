import { searchquestions } from "./fetch_data.js";

function printoutQuestion(qna, bot, fromId, resp) {
    qna.forEach((item) => {
        resp = `Question: ${item.question}

Answer: ${item.answer}`;
        console.log(resp);
        bot.sendMessage(fromId, resp);
        resp = "";
    });
}

function botOnQuestionOnly(bot) {
    bot.onText(/\/question/, function (msg) {
        let chatId = msg.chat.id;
        let resp = "/question <keyword> - Please type in the questions and answers keyword to start the Search.";
        if (msg.text === "/question") {
            bot.sendMessage(chatId, resp);
        }
    });
}

function botOnQuestionKeyword(bot) {
    bot.onText(/\/question (.+)/, async function (msg, match) {
        try {
            let fromId = msg.from.id;
            let resp = "";
            let input = match[1];
            let result = (await searchquestions(input)).data;
            if (result.length != 0) {
                printoutQuestion(result, bot, fromId, resp);
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

export { botOnQuestionOnly, botOnQuestionKeyword}