import {useState, useEffect} from 'react';
const keys = require('../../keys');

function Current_user() {

    const [user, setUser] = useState("No user");
    useEffect(() => {
        fetch(`${keys.url_encrypt.key}/auth/return_auth`)
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