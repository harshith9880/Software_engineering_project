import { fetchNewsData, fetchNewsByCategory } from "../services/newsdata.js"

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
        let newsData;

        if (category && category.toLowerCase() !== 'all') {
            newsData = await fetchNewsByCategory(category);
        } else {
            newsData = await fetchNewsData('');
        }

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

export const getPersonalizedFeed = async (req, res) => {
    try {
        const { preferences } = req.body;

        if (!preferences || preferences.length === 0) {
            const newsData = await fetchNewsData('');
            return res.status(200).json({ success: true, count: newsData.length, data: newsData });
        }

        // Fetch news for each preference in parallel, then combine
        const results = await Promise.allSettled(
            preferences.slice(0, 3).map(cat => fetchNewsByCategory(cat))
        );

        const combined = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value)
            .slice(0, 30);

        res.status(200).json({
            success: true,
            count: combined.length,
            data: combined
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};