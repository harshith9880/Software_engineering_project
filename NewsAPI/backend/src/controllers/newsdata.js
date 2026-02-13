import { fetchNewsData } from "../services/newsdata.js"

export const getNewsData = async (req, res) => {
    try {
        const { query } = req.query;

        const newsData = await fetchNewsData(query);

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