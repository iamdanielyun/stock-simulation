function News_article(props) {
    return (
        <div className="news_article">
            <h3><strong>{props.data.headline}</strong></h3>
            <h5><i>{props.data.date}</i></h5>
            <img className="article_image" src={props.data.image} />
            <br />
            <h6>{props.data.summary}</h6>
            <a href={props.data.url} target="_blank">{props.data.source}</a>
        </div>
    )
}

export default News_article;