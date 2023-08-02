import {useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
const keys = require('../../keys');

function Logout() {

    const [result, setResult] = useState(null);

    useEffect(() => {
        fetch(`${keys.url_encrypt.key}/auth/logout`, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            setResult(data.message);
        })
        .catch(err => console.log(err));
    }, [])
    
    return (
        <div>
            {
                result === "success" ? <Navigate to="/"/> : <h1>Something went wrong</h1>
            }
        </div>
    )
}

export default Logout;