import {
    findProductByKeywordInDB,
    findProductByKeywordPriceInDB
} from './database_search_advancesearch.js';

export async function getProductWithKeyword(app) {
    app.get("/search/:keyword?", async (req, res) => {
        try {
            let keyword = req.params.keyword;
            if (!keyword) {
                res.status(200).send({ message: "Input a keyword to start the search." });
                return;
            };
            let searchResults = await findProductByKeywordInDB(keyword);
            if (searchResults.length > 0) {
                res.send(searchResults);
            } else {
                res.status(200).send({ message: `No products found for the keyword "${keyword}".` });
            }
        } catch (err) {
            res.status(404).send({ message: "Error occurred while searching for products." });
            console.error(err);
        }
    });
}

export async function getProductWithKeywordPrice(app) {
    app.get("/advancesearch/:queryparams?", async (req, res) => {
        try {
            let queryparams = req.params.queryparams;
            if (!queryparams) {
                queryparams = req.query.queryparams;
                if (!queryparams) {
                    res.status(200).send({ message: "Input a keyword and price range to start the search." });
                    return;
                }
            };

            let [inputProductKeyword, inputPriceRange] = req.params.queryparams.split("&");

            // Check if the input has both keyword and price range
            if (!inputProductKeyword || !inputPriceRange) {
                res.status(400).send({
                    message: "Please provide both a keyword and a price range separated by '&'. For example: /advancesearch/cleaner&10-30"
                });
                return;
            }
            let inputRangeArray = inputPriceRange.split("-");
            let minPrice = parseFloat(inputRangeArray[0]);
            let maxPrice = parseFloat(inputRangeArray[1]);

            let advanceSearchResults = await findProductByKeywordPriceInDB(inputProductKeyword, minPrice, maxPrice);
            console.log(advanceSearchResults.length);
            if (advanceSearchResults.length > 0) {
                res.send(advanceSearchResults);
            } else {
                res.status(200).send({
                    message: `No products found matching the keyword "${inputProductKeyword}" and price range $${minPrice} to $${maxPrice}`
                });
            }
        } catch (err) {
            res.status(404).send({ "Error": "Error occurred during product keyword and price range search." });
            console.error(err);
        }
    })
};