import {useState, useEffect} from 'react';
import News_article from './News_article';
const keys = require("../keys");

function News(props) {
    document.getElementById("news_loading").style.display = "none";
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${keys.baseURL}/api/news/${props.data}`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {console.log(data); setData(data);})
        .catch(err => console.log(err));
    }, [])

    if(typeof(data) != 'undefined' && data.length > 0)
    {
        return (
            <div className="list-group">
                {
                    data.map(article => {
                        var params = {
                            "date": new Date(article.datetime * 1000).toLocaleDateString('en-us', 
                                    { weekday:"long", year:"numeric", month:"short", day:"numeric"}),
                            "headline": article.headline,
                            "image": article.image,
                            "related": article.related,
                            "source": article.source,
                            "summary": article.summary,
                            "url": article.url
                        };
                        return (
                            <div class="list-group-item">
                                <News_article data={params}/>
                            </div>
                        )
                        
                    })
                }            
            </div>
        )
    }
    else
    {
        return (
            <div className="article_error">
                <h1><b><i>No news available...</i></b></h1>
            </div>
        )
    }
    
}

export default News;