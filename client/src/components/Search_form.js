import {useState, useEffect} from 'react';
import Symbols_dropdown from "./Symbols_dropdown"

//Handle when user types in search bar
function search_handle(setSymbol, setUser_typed) {
    setSymbol(document.getElementById("search").value);
    setUser_typed(true);
}

function contains(string, target) {
    return string.indexOf(target) >= 0;
}

function Search_form() {
    var [symbol, setSymbol] = useState("");
    var [user_typed, setUser_typed] = useState(false);

    return (
        <form className="form-inline">
            <input className="form-control mr-sm-2" id="search" name="search" type="search" 
                placeholder="e.g. AAPL" aria-label="Search" 
                onChange={() => search_handle(setSymbol, setUser_typed)}>
            </input>

            {(user_typed && symbol != "" && !contains(symbol,' '))? (
                <div id="dropdown_menu" className="symbols_dropdown">
                    <Symbols_dropdown data={symbol} show={true}/>
                </div>
            ): (
                user_typed = false
            )}

            {/* <button onClick={search_handle} className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
        </form>
    )
}

export default Search_form;