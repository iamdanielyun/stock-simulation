import {useState, useEffect} from "react";
import { Outlet} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import useCheck_auth from "./auth/useCheck_auth";
import Search_form from "./Search_form";
const keys = require("../keys");

function contains(string, target) {
    return string.indexOf(target) >= 0;
}

//Handle when user types in search bar
function search_handle(setSymbol, setUser_typed) {
    setSymbol(document.getElementById("search").value);
    setUser_typed(true);
}

function Navbar() {

    var [symbol, setSymbol] = useState("");
    var [user_typed, setUser_typed] = useState(false);
    const location = useLocation();
    const authenticated = useCheck_auth();
    const profile_class = authenticated ? "nav-link" : "nav-link disabled";

    return (
        
        <div className="App">
            <nav className="navbar sticky-top navbar-expand-sm bg-light">
                <a id="logo" className="navbar-brand" href="/">Stock Simulation</a>

                {location.pathname === "/" ? <Search_form /> : null}
                {location.pathname === "/" ? 
                    <i>* Make sure to empty out field before querying again *</i> 
                    : null
                }
                
                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">
                        <a className={profile_class} href="/profile">
                        Profile
                        </a>
                    </li>
                    {
                        !authenticated && 
                        <li className="nav-item">
                            <a className="nav-link" href="/login">
                                Login
                            </a>
                        </li>
                    }
                    
                    {
                        authenticated && 
                        <li className="nav-item">
                            <a className="nav-link" href="/logout">
                                Logout
                            </a>
                    </li>
                    }
                    
                </ul>
            </nav>
                        
            <Outlet />
        </div>
    );
}

export default Navbar;