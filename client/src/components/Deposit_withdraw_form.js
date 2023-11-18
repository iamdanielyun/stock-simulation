import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import keys from "../keys";

function Deposit_withdraw_form() {

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const option = document.getElementById("deposit_option").checked ? "deposit" : "withdraw";
        const amount = document.getElementById("action_amount").value;
        const password = document.getElementById("password").value;

        if(amount <= 0 || amount == "")
            setMsg("Please enter a valid amount");
        else
        {
            fetch(`${keys.url_encrypt.key}/auth/d_w`, {
                method: "POST",
                body: JSON.stringify({
                    option: option,
                    amount: amount,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
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
        <div className="deposit_form">
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="radio_option" id="deposit_option" value="deposit" defaultChecked></input>
                    Deposit
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="radio_option" id="withdraw_option" value="withdraw"></input>
                    Withdraw
                </div>
                <div className="form-group">
                    <input type="number" min="1" step=".01" className="form-control" id="action_amount" placeholder="e.g. 56.42"></input>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Enter password"></input>
                </div>
                {
                    msg != "" && msg != "success"? 
                        <div className="error_msg">
                            *{msg}*
                        </div>
                    : null
                }
                <button type="submit" className="btn btn-primary">Submit</button><br />
            </form>
        </div>
    )
}

export default Deposit_withdraw_form;