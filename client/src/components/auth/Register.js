import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import login_icon from '../../icons/login_icon.png';
const keys = require('../../keys');

function Register() {

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmation = document.getElementById("confirmation").value;

        fetch(`${keys.url_encrypt.key}/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
                confirmation: confirmation
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);

            if(data.status === 201) {
                navigate("/");
                window.location.reload(true);   
            }
            else {
                setMsg(data.message);
                navigate("/register");
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="login_page">
            <img src={login_icon} className="App-logo" alt="logo" />
            <form onSubmit={(e) => handleSubmit(e)} className="login_form">
                <div className="form-group">
                    <input type="input" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Username"></input>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Password"></input>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="confirmation" placeholder="Confirm Password"></input>
                </div>
                {msg != "" ? 
                <div className="error_msg">
                    <i>*{msg}*</i>
                </div>
                : null
                }
                <button type="submit" className="btn btn-primary">Register</button><br />
                <a href='/login'>Already have an account? Log in</a>
            </form>
        </div>
    )
}

export default Register;