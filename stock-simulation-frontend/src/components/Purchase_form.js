import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import useCheck_auth from "./auth/useCheck_auth";
import keys from '../keys';

function Purchase_form(props) {

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const authenticated = useCheck_auth();
    var buttonClass = authenticated ? "btn btn-primary" : "btn btn-primary disabled";

    //Purchase function
    function purchase(e) {
        e.preventDefault(); 
        const shares = document.getElementById("shares").value;
        const symbol = props.symbol;
        const price = props.price;
        const name =  props.name;

        if(shares > 0) {
            fetch(`${keys.baseURL}/auth/action`, {
                method: "POST",
                body: JSON.stringify({
                    action: "buy",
                    symbol: symbol,
                    shares: shares,
                    price: price,
                    name: name
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
        else
            setMsg("Please order a valid number of shares");
    }

    return (
        <form onSubmit={(e) => purchase(e)} className="purchase_form">
            <div className="form-group">
                <input min="1" type="number" className="form-control" id="shares" placeholder="# shares"></input>
            </div>
            {
                msg != "" && msg != "success"? 
                    <div className="error_msg">
                        *{msg}*
                    </div>
                : null
            }
            <button type="submit" className={buttonClass}>Order</button>
            {
                !authenticated ?
                    <div className="purchase_unathenticated">
                        <i>Please <a href="/login">login</a></i>
                    </div>
                : null
            }
        </form>
    )
}

export default Purchase_form;