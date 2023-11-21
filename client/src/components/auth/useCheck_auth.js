import {useState, useEffect} from 'react';
const keys = require('../../keys');

function useCheck_auth() {

    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        fetch(`${keys.baseURL}/auth/return_auth`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => data.authenticated === true ? setAuthenticated(true) : null)
        .catch(err => console.log(err));
    }, [])

    return authenticated;
}

export default useCheck_auth;