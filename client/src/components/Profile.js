import {useState, useEffect} from 'react';
import Deposit_withdraw_form from './Deposit_withdraw_form';
import Sell from './Sell';
const keys = require("../keys");

function Profile() {

    const [result, setResult] = useState(null);

    useEffect(() => {
        fetch(`${keys.url_encrypt.key}/auth/profile`)
        .then(response => response.json())
        .then(data => {console.log(data); setResult(data)})
        .catch(err => console.log(err));
    }, [])

    if(result != null)
    {
        const user = result.user ? result.user : "none";
        const cash = typeof(result.cash) == "none" ? 0 : Number(result.cash).toFixed(2);
        const stock_symbols = typeof(result.stock_symbols) === "undefined" ? "No stocks yet" : result.stock_symbols;
        const all_stocks = typeof(result.stocks) === "undefined" ? "No stocks yet" : result.stocks;

        return (
            <div className="profile_page">
                <br />
                <h3>Hello, <i>{user}</i></h3>
                
                <div className="cash">
                    <h3>${cash}</h3>
                    <br />
                    <Deposit_withdraw_form />
                </div>
               
                <div className="investments">

                    {stock_symbols.length === 0 ? <h2>Start trading today!</h2> : 
                    
                        <ul className="list-group list-group-flush">
                            {
                                stock_symbols.map(stock => {
                                    const symbol = stock.symbol;
                                    const company = stock.company;
                                    const count = stock.count;
                                    var total_purchased_price = 0;

                                    //Get the total amount spent on this stock
                                    all_stocks.map(obj => {
                                        if(obj.symbol === symbol) { 
                                            total_purchased_price += Number(obj.price_purchased);
                                        }
                                    })

                                    return (
                                        <li className="list-group-item bg-transparent text-white border-0">
                                            <p className="stock_display">
                                                {/* <h3 className="stock_display">{company}</h3> &nbsp; */}
                                                <b><h4><i>{symbol}</i></h4></b> &nbsp;&nbsp;
                                                x{count} 
                                            </p>
                                            <Sell before={total_purchased_price} symbol={symbol} shares={count}/>
                                            <br />
                                        </li>

                                    )
                                })
                            }
                        </ul>
                    }
                </div>
            </div>
            
        )
    }
    else 
    {
        return (
            <div className="profile_page">
                <h2>Please login again</h2>
            </div>
        )
    }
    
}

export default Profile;