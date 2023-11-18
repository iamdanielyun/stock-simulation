const router = require("express").Router();
const axios = require("axios");
const keys = require("../../src/keys");      //Not included in Github

//Receive data (from twelvedata)
const get_data = async (query, params) => {

    const options = {
        method: 'GET',
        url: `https://api.twelvedata.com/${query}`,
        params: params
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.log(error);
        //res.send(error);
    }
}

//Weed out symbols that are out of the basic plan or not USD
function weed_out(data) {
    return (data.country === "United States" &&
            data.access.plan === "Basic");
}

//Get all symbols like ${symbol}
router.get("/symbols_like/:symbol", async (req, res) => {

    const params = {
        symbol: req.params.symbol,
        show_plan: true,
        apikey: keys.twelvedata.key
    };
    const response = await get_data('symbol_search', params);
    const result = response.data.data.filter(weed_out);

    res.send({
        "data": result
    });
})

//Stock info (Current_price, highs, lows, etc)
router.get("/stock_info/:symbol", async (req, res) => {

    //Stock quote
    const quote_options = {
        method: 'GET',
        url: `https://financialmodelingprep.com/api/v3/profile/${req.params.symbol}`,
        params: {
            apikey: keys.financialprep.key,
        }
    };

    //Price changes
    const price_change_options = {
        method: 'GET',
        url: "https://finnhub.io/api/v1/quote",
        params: {
            token: keys.finnhub.key,
            symbol: req.params.symbol,
        }
    };

    //For prices within the past week for chart
    const to = Math.floor(new Date().getTime() / 1000);
    const from = to - (604800 * 4);     //4 weeks (past month)
    const history_options = {
        method: 'GET',
        url: "https://finnhub.io/api/v1/stock/candle",
        params: {
            token: keys.finnhub.key,
            symbol: req.params.symbol,
            resolution: 'D',
            from: from,
            to: to
        }
    };

    try {
        //Responses => data
        const quote_response = await axios.request(quote_options);
        const price_change_response = await axios.request(price_change_options);
        const history_response = await axios.request(history_options);
        const quote_data = quote_response.data[0];             
        const price_change_data = price_change_response.data;
        const history_data = history_response.data;
        var result;

        //if it's a symbol that isn't available on either of these sites, use twelvedata
        if(typeof(quote_data) === 'undefined')
        {
            const params = {
                symbol: req.params.symbol,
                apikey: keys.twelvedata.key
            };
            const q_response = await get_data('quote', params);
            const p_response = await get_data('price', params);
            const p_data = p_response.data;

            result = {
                "data": {
                    "current_price": p_data.price,
                    "symbol": q_response.data.symbol,
                    "name": q_response.data.name,
                    "exchange": q_response.data.exchange,
                    "change": q_response.data.change,
                    "percent_change": q_response.data.percent_change,
                    "history": "Company History Unavailable",
                    "description": "Company Description Unavailable"
                }
            }
        }
        else
        {
            result = {
                "data": {
                    "current_price": quote_data.price,
                    "symbol": quote_data.symbol,
                    "name": quote_data.companyName,
                    "description": quote_data.description,
                    "exchange": quote_data.exchangeShortName,
                    "change": price_change_data.d,
                    "percent_change": price_change_data.dp,
                    "history": {
                        "close_prices": history_data.c,
                        "open_prices": history_data.o,
                        "highs": history_data.h,
                        "lows": history_data.l,
                        "dates": history_data.t,
                    }
                }
            };
        }
    
        res.send(result);
    }
    catch(err) {
        console.log(err);
        res.send(err);
    }
    
})

//News (from finnhub)
router.get("/news/:symbol", async (req, res) => {

    const to = new Date();
    var to_day = to.getDate();
    var to_month = to.getMonth() + 1;
    const to_year = to.getFullYear();

    const from = new Date(to.getDate()-15);     //4 weeks (past month)
    var from_day = from.getDate();
    var from_month = from.getMonth() + 1;
    const from_year = from.getFullYear();

    //Add zeros in front of the dates if necessary
    if (to_day < 10) 
        to_day = `0${to_day}`;
    
    if (to_month < 10) 
        to_month = `0${to_month}`;

    if (from_day < 10) 
        from_day = `0${from_day}`;
    
    if (from_month < 10) 
        from_month = `0${from_month}`;
    

    const options = {
        method: 'GET',
        url: "https://finnhub.io/api/v1/company-news",
        params: {
            token: keys.finnhub.key,
            symbol: req.params.symbol,
            from: `${from_year}-${from_month}-${from_day}`,
            to: `${to_year}-${to_month}-${to_day}`
        }
    };

    try {
        const response = await axios.request(options);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

//Test route for debugging purposes
router.get("/test/:symbol", async (req, res) => {

    const to = Math.floor(new Date().getTime() / 1000);
    const from = to - 604800;
    const history_options = {
        method: 'GET',
        url: "https://finnhub.io/api/v1/stock/candle",
        params: {
            token: keys.finnhub.key,
            symbol: req.params.symbol,
            resolution: 'D',
            from: from,
            to: to
        }
    };

    try {
        const response = await axios.request(history_options);
        //console.log(response.data);
        res.send(response.data.t);
    } catch (error) {
        console.error(error);
    }
})

// // //Real time value of ${symbol}
router.get("/current_price/:symbol", async (req, res) => {

    const symbol = req.params.symbol;
    const uri1 = `https://realstonks.p.rapidapi.com/${symbol}`;
    const options = {
        method: 'GET',
        url: uri1,
        headers: {
            'X-RapidAPI-Key': keys.xrapid.key,
            'X-RapidAPI-Host': keys.xrapid.host
        }
    };

    const response = await axios.request(options);
    const data = response.data.price;
    res.send({
        "current_price": Number(data).toFixed(2)
    })

})


module.exports = router;