import axios from 'axios';

export const fetchNewsData = async (query, category = '') => {
    console.log("Fetching from NewsAPI.org with query:", query, "category:", category);
    
    try {
        const url = query 
            ? "https://newsapi.org/v2/everything" 
            : "https://newsapi.org/v2/top-headlines";

        const response = await axios.get(url, {
            params: {
                apiKey: process.env.NEWS_API_KEY,
                q: query || undefined,
                category: category || undefined,
                language: 'en',
                pageSize: 20
            }
        });

        // NewsAPI.org returns { articles: [...] }
        return response.data.articles || [];
    } catch (error) {
        console.error("NewsAPI Error Details:", error.response?.data || error.message);
        throw error;
    }
};