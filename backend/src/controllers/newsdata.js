import { fetchNewsData } from "../services/newsdata.js"

export const getNewsData = async (req, res) => {
    try {
        const { q, query } = req.query;
        const searchQuery = q || query;

        const newsData = await fetchNewsData(searchQuery);

        res.status(200).json({
            success: true,
            count: newsData.length,
            data: newsData
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

        const newsData = await fetchNewsData(category || '');

        res.status(200).json({
            success: true,
            count: newsData.length,
            data: newsData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};