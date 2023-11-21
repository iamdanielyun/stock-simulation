import {useState, useEffect} from 'react';
const keys = require('../../keys');

function Current_user() {

    const [user, setUser] = useState("No user");
    useEffect(() => {
        fetch(`${keys.baseURL}/auth/return_auth`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => setUser(data.username))
        .catch(err => console.log(err));
    });

    return (
        <h2>
            {user}
        </h2>
    )
}

export default Current_user;