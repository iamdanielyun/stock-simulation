import {useState, useEffect} from 'react';
import Purchase_form from './Purchase_form';
import Stock_chart from './Stock_chart';
const keys = require("../keys");

function Stock_info(props) {
    document.getElementById("stock_loading").style.display = "none";
    
    const [data, setData] = useState(null);
    useEffect(() => {
        if(props.data != "" && typeof(props) !== 'undefined') 
        {
            fetch(`${keys.baseURL}/api/stock_info/${props.data}`, {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {console.log("D" + data.data); setData(data.data)})
            .catch(err => console.log(err));
        }
        else
            console.log("STOP")
    }, [])
    
    if(data != null)
    {
        const current_price = Number(data.current_price).toFixed(2);
        const description = data.description;
        const symbol = data.symbol;
        const name = data.name;
        const change = Number(data.change).toFixed(2);
        const percent_change = Number(data.percent_change).toFixed(2);
        const exchange = data.exchange;
        const history = data.history;
        const arrow = change > 0 ? "↑" : "↓";
        const arrow_class = change > 0 ? "positive_arrow" : "negative_arrow";
        
        //Values for history chart
        const history_props = {
            title: symbol,
            dates: history.dates,
            closing_prices: history.close_prices
        };

        return (
            <div className="stock_details">
                <br />
                <div className="stock_title">

                    {/* Company name and price */}
                    <h2><strong>{name}</strong></h2>
                    <h6><i>({exchange}: {symbol})</i></h6>
                    <b><h3>${current_price}</h3></b>
                    <b className={arrow_class}>{arrow} ${change} ({percent_change}%)</b>
                    <Purchase_form price={current_price} name={name} symbol={symbol}/>

                </div>
                <br />
                <br />

                {/* Company Summary */}
                <div className='stock_description'>
                    <h5>{description}</h5>
                </div>

                {/* Stock chart */}
                <div className="stock_chart">
                    {(history === 'Company History Unavailable' || JSON.stringify(history) === '{}') 
                        ? <h5>Company History Unavailable</h5> 
                        : 
                        <div id="chartContainer">
                            <Stock_chart data={history_props}/>
                        </div>
                    }
                </div>
            </div>
        )
    }
    else
    {
        return (
            <div className="stock_loading">
                <h1><b>...</b></h1>
            </div>
        )
    }
    
}

export default Stock_info;