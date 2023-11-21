import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import keys from '../keys';

function Sell(props) {

    const symbol = props.symbol;
    const shares = props.shares;
    const total_purchased_price = Number(props.before).toFixed(2);
    const [price, setPrice]  = useState("...");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    //get current_price
    useEffect(() => {
        fetch(`${keys.baseURL}/api/current_price/${symbol}`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setPrice(data.current_price);
        })
        .catch(err => console.log(err));
    }, [])

    const total_current_price = isNaN(price) ? "..." : Number(price*shares).toFixed(2);
    const diff = (1.0 * (total_current_price -  total_purchased_price)) / total_purchased_price;     //to do decimal division and no integer rounding
    const percent_change = isNaN(price) ? "..." : Number(diff * 100).toFixed(2);
    const color = percent_change > 0 ? "positive_arrow" : "negative_arrow";
    const arrow = percent_change > 0 ? "↑" : "↓";

    //handle sell
    function sell(e) {
        e.preventDefault();
        const shares_to_sell = document.getElementById(symbol).value;

        console.log("shares to sell: " + shares_to_sell)
        console.log("shares owned: " + shares)

        if(shares_to_sell <= 0)
            setMsg("Please enter a valid number of shares");
        else if(shares_to_sell > shares)
            setMsg("That's more than what you own!");
        else
        {
            fetch(`${keys.baseURL}/auth/action`, {
                method: "POST",
                body: JSON.stringify({
                    action: "sell",
                    symbol: symbol,
                    price: price,
                    shares_to_sell: shares_to_sell,
                    shares_owned: shares
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                setMsg(data.message);
    
                if(data.message === "success")
                {
                    navigate("/profile");
                    window.location.reload(true);      
                }
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className="stock_display">
            <div>
                ${total_purchased_price} {"   --->   "} <p className={color}>${total_current_price} {arrow}({percent_change}%)</p>
            </div>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <form onSubmit={(e) => sell(e)} className="sell_form">
                <div className="form-group">
                    <input min="1" type="number" className="form-control" id={symbol} placeholder="# shares"></input>
                </div>

                {
                    msg != "" && msg != "success"? 
                        <div className="error_msg">
                            *{msg}*
                        </div>
                    : null
                }
                <div>
                    <button type="submit" className='btn btn-primary'>Sell</button>
                </div>
            </form>
        </div>
    )
}

export default Sell;