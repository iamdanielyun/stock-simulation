import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import login_icon from '../../icons/login_icon.png';
const keys = require('../../keys');

function Login() {

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        fetch(`${keys.baseURL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
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
                navigate("/login");
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
                {msg != "" ? 
                <div className="error_msg">
                    <i>*{msg}*</i>
                </div>
                : null
                }
                <button type="submit" className="btn btn-primary">Login</button><br />
                <a href='/register'>Don't have an account? Sign up</a>
            </form>
        </div>
    )
}

export default Login;