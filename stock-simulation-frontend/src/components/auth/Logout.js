import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

const keys = require('../../keys');

function Logout() {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetch(`${keys.baseURL}/auth/logout`, {
            method: "POST",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            setResult(data.message);

            if(data.message === "success")
            {
                navigate("/");
                window.location.reload(true);
            }
        })
        .catch(err => console.log(err));
    }, [])

    // return (
    //     <div>
    //         {
    //             result === "success" ? <Navigate to="/"/> : <h1>Something went wrong</h1>
    //         }
    //     </div>
    // )
    return (
        <div className="stock_loading">
            <h1><b>...</b></h1>
        </div>
    )
}

export default Logout;