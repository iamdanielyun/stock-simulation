import Stock_info from "./Stock_info";
import Symbols_dropdown from "./Symbols_dropdown";
import Stock_loading from "./Stock_loading";
import News_loading from "./News_loading";
import News from "./News";

function Home(props) {
    return (
        <div className="Home">

            {/* Buy/Sell and stock info page */}
            <div id="main_stock_page" className="stock_info">
                <div id="stock_loading">
                    <Stock_loading />
                </div>
                {/* <Stock_info /> */}
            </div> 

            {/* stock news */}
            <div id="main_news_page" className="news">
                <div id="news_loading">
                    <News_loading />
                </div>
                {/* <News /> */}
            </div> 
    
        </div>
    )
}

export default Home;