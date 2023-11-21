import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Stock_info from './Stock_info';
import News from './News';
import {createPortal} from 'react-dom';
const keys = require("../keys");

var g_symbol = "";

//Handle when user selects one of the symbols listed
function handle(setClicked, symbol) {
    setClicked(true); 
    document.getElementById("dropdown_menu").style.display = "none";
    document.getElementById("search").value = symbol;
    g_symbol = symbol;
}

function Symbols_dropdown(props) {
    
    const [data, setData] = useState([]);
    var [clicked, setClicked] = useState(false);
     
    useEffect(() => {
        fetch(`${keys.baseURL}/api/symbols_like/${props.data}`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setData(data.data))
        .catch(err => console.log(err));
    }, [props.data]);

    return (
        <div className="App">

            {/* If user clicked on symbol */}
            {(clicked && g_symbol != "") ? 
                (
                    <div>
                        {/* For stock info */}
                        {createPortal(
                            <Stock_info data={g_symbol}/>,
                            document.getElementById("main_stock_page")
                        )}

                        {/* For stock news */}
                        {createPortal(
                            <News data={g_symbol}/>,
                            document.getElementById("main_news_page")
                        )}
                    </div>
                ) : null
            }

            {/* List out all the symbols like what the user searched */}
            <div className='list-group'>
                {data.length > 0 ? 
                data.map((instrument,i) => {
                    const symbol = instrument.symbol;
                    const name = instrument.instrument_name;

                    return (
                        <Link to={{
                            pathname: "/"
                          }} key={i} className="list-group-item list-group-item-action" onClick={() => handle(setClicked, symbol)}>
                                <b>{symbol}</b> 
                                <p className="instrument_name">{name}</p>
                          </Link>
                    )})
                    : <h5><i>No results</i></h5>
                }
            </div>      
        </div>
        
    )
}

export default Symbols_dropdown;