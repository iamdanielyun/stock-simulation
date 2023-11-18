const express = require("express");
const router = require("express").Router();
const session = require("express-session");
const axios = require("axios");
const keys = require("../../src/keys");      //Not included in Github
const User = require("../models/user");
const { response } = require("express");

//Middlewares
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(session({
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //milliseconds in a day
    secret: [keys.session.secret],
    saveUninitialized: false,
    resave: false
}));

//Check authentication
const authenticated = (req, res, next) => {
    if(req.session) 
    {
        if(!req.session.userid) {
            console.log("Need user id");
            res.send("Not authenticated")
        }
        else {
            next();
        }
    }
    else{
        console.log("No session in the first place.");
        res.send("No session in the first place.");
    }   
}

//Return auth status
router.get("/return_auth", (req, res) => {
    res.send({
        "authenticated": req.session.userid != undefined,
        "username": req.session ? req.session.userid : "No user"
    })
})

//Profile page
router.get("/profile", authenticated, async (req, res) => {

    //Get user first
    var user;
    try {
        user = await User.findOne({
            username: req.session.userid
        })
    }
    catch(err) {
        console.log(err);
        res.send("error");
    }

    //data
    const investments = user.investments;
    const stock_list = investments.stock_list;
    const stocks = investments.stocks;
    const cash = Number(investments.cash).toFixed(2);
    
    res.send({
        "user": user.username,
        "cash": cash,
        "stocks": stocks,
        "stock_symbols": stock_list
    });
})

//Buy/Sell
router.post('/action', async (req, res) => {

    //params
    const action = req.body.action;
    const symbol = req.body.symbol;
    const price = req.body.price;

    var user;
    try {
        user = await User.findOne({
            username: req.session.userid
        });
    }
    catch(err) {
        console.log(err);
    }

    var investments = user.investments;
    var stock_symbols = investments.stock_list;
    var cash = investments.cash;

    //if action is buy
    if(action === "buy")
    {
        const shares = req.body.shares;
        const company = req.body.name;

        //Does user have enough cash?
        if(cash < (shares * price)) {
            return res.send({
                "message": "Insufficient funds"
            });
        }

        //Subtract amount from cash
        var update = await User.updateOne(
            {username: user.username},
            {$set: {
                "investments.cash": cash - (shares * price)
            }}
        );
        
        //Increment count if already have this stock
        var already_have = false;
        stock_symbols.forEach(stock => {
            const current_count = stock.count;

            if(stock.symbol === symbol) {
                already_have = true;
                User.updateOne(
                    {
                        username: user.username,
                    },
                    {$set: {
                        "investments.stock_list.$[element].count": Number(current_count + Number(shares))
                    }},
                    { arrayFilters: [ { "element.symbol": { $eq: symbol } } ] }
                )
                .then(response => console.log(response));
            }
        })

        //if not, add it 
        if(!already_have)
        {
            update = await User.updateOne(
                {username: user.username},
                {$push: {
                    "investments.stock_list": {
                        symbol: symbol,
                        company: company,
                        count: shares
                    }
                }}
            );
        }

        //For every share, enter one entry into 'stocks'
        for(let i=0; i<shares; i++)
        {
            update = await User.updateOne(
                {username: user.username},
                {$push: {
                    "investments.stocks": {
                        symbol: symbol,
                        company: company,
                        price_purchased: price
                    }
                }}
            );
        }
        

        res.send({
            "message": "success"
        });
    }

    //if action is sell
    else
    {
        const shares_to_sell = req.body.shares_to_sell;
        const shares_owned = req.body.shares_owned;

        //Add amount to cash
        var update = await User.updateOne(
            {username: user.username},
            {$set: {
                "investments.cash": cash + (shares_to_sell * price)
            }}
        );

        //if selling all stocks, remove this stock from stock_list
        if(shares_to_sell == shares_owned)
        {
            const dte = await User.updateOne(
                {
                    username: user.username,
                },
                {
                    $pull: {
                        "investments.stock_list": {symbol: symbol}
                    }
                }
            )
            // .then(response => console.log(response));
        }
        else
        {
            //else update stock_list
            stock_symbols.forEach(stock => {
                const current_count = stock.count;

                if(stock.symbol === symbol) {
                    User.updateOne(
                        {
                            username: user.username,
                        },
                        {$set: {
                            "investments.stock_list.$[element].count": Number(current_count - Number(shares_to_sell))
                        }},
                        { arrayFilters: [ { "element.symbol": { $eq: symbol } } ] }
                    )
                    .then(response => console.log(response));
                }
            })
        }

        //Remove from all_stocks
        var all_stocks = user.investments.stocks;
        var removed = 0;
        var ids = [];

        for(let i=0; i<all_stocks.length; i++)
        {
            if(all_stocks[i].symbol === symbol)
            {
                ids.push(all_stocks[i]._id);
                removed++;
            }

            if(removed == shares_to_sell) {
                console.log("break")
                break;
            }
        }

        for(let i=0; i<ids.length; i++)
        {
            const dte = await User.updateOne(
                {
                    username: user.username,
                },
                {
                    $pull: {
                        "investments.stocks": {_id: ids[i]}
                    }
                }
            )
        }
         
        res.send({
            "message": "success"
        })
        
    }
})

//Deposit
router.post("/d_w", async (req, res) => {

    const username = req.session.userid;
    const amount = Number(req.body.amount);
    const option = req.body.option;
    const password = req.body.password;

    var user;
    try {
        user = await User.findOne({
            username: username,
            password: password
        });

        //if user doesn't exist, they provided wrong password
        if(!user) {
            return res.send({
                "message": "Wrong password"
            });
        }

        //current balance
        const current_cash = user.investments.cash;

        if(option === 'deposit')
        {
            try {
                var update = await User.updateOne(
                    {username: username},
                    {$set: {
                        "investments.cash": (current_cash + amount)
                    }}
                )
            }
            catch(err) {
                console.log(err);
            }
        }
        else
        {
            //trying to withdraw more than they have
            if(current_cash < amount) {
                return res.send({
                    "message": "Insufficient funds"
                });
            }

            try {
                var update = await User.updateOne(
                    {username: username},
                    {$set: {
                        "investments.cash": (current_cash - amount)
                    }}
                )
            }
            catch(err) {
                console.log(err);
            }
        }

        return res.send({
            "message": "success"
        });
    }
    catch(err) {
        console.log(err);
    }

})

//Register
router.post("/register", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

    //If missing any fields
    if(!(username && password && confirmation)) {
        return res.send({
            "status": 401,
            "message": "Missing one of the fields"
        });
    }

    //if password != confirmation
    if(password != confirmation) {
        return res.send({
            "status": 401,
            "message": "Password does not match confirmation"
        });
    }

    //Check if user already exists
    const user = await User.findOne({
        username: username
    });

    if(user) {
        return res.send({
            "status": 401,
            "message": "Username taken"
        });
    }

    //Enter user into database
    const new_user = new User({
        username: username,
        password: password, 
        'investments.cash': 0
    }).save();

    //Set session
    req.session.userid = username;

    //Send ok message
    return res.send({
        "status": 201,
        "message": "User created"
    });
})


//Login
router.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    //If missing any fields
    if(!(username && password)) {
        return res.send({
            "status": 401,
            "message": "Missing one of the fields"
        });
    }

    //Get user
    const user = await User.findOne({
        username: username,
        password: password
    });

    if(!user) {
        return res.send({
            "status": 401,
            "message": "Wrong username and/or password"
        });
    }

    //Set session
    req.session.userid = username;

    return res.send({
        "status": 201,
        "message": "Session created"
    });
    
})

//logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.send("Error");
        }
        else
        {
            res.clearCookie(this.cookie, { path: '/' });
            console.log("logged out");
            res.send({
                "message": "success"
            })
        }
    });
})



module.exports = router;