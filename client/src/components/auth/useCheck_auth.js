import {useState, useEffect} from 'react';
const keys = require('../../keys');

function useCheck_auth() {

    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        fetch(`${keys.url_encrypt.key}/auth/return_auth`)
        .then(response => response.json())
        .then(data => data.authenticated === true ? setAuthenticated(true) : null)
        .catch(err => console.log(err));
    }, [])

    return authenticated;
}

export default useCheck_auth;