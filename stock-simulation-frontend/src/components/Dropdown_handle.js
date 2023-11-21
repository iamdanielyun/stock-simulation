import {useState, useEffect} from 'react';
import Stock_info from './Stock_info';
const keys = require("../keys");


//Handle clicking on one of the many symbols listed in dropdown
function Dropdown_handle(props) {
    
    const [data, setData] = useState([]);
    const symbol = props.data;

    useEffect(() => {
        fetch(`${keys.baseURL}/api/stock_info/${symbol}`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {setData(data); console.log(data)})
        .catch(err => console.log(err));
    }, [symbol]);

    <div className="stock_info">
        <Stock_info data={data}/>
    </div> 
    //e.preventDefault();
}

export default Dropdown_handle;