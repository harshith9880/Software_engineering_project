import { fetchNewsData } from "../services/newsdata.js"

export const getNewsData = async (req, res) => {
    try {
        const { q } = req.query;
        const articles = await fetchNewsData(q);

        res.status(200).json({
            articles: articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: { name: article.source.name }
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTopHeadlines = async (req, res) => {
    try {
        const { category } = req.query;
        const articles = await fetchNewsData(null, category);

        res.status(200).json({
            articles: articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: { name: article.source.name }
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};