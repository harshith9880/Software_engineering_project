import axios from 'axios';

export const fetchNewsData = async (query) => {
    const response = await axios.get(
        "https://newsdata.io/api/1/latest",
        {
            params: {
                apikey: process.env.NEWS_API_KEY,
                q: query
            }
        }
    );

    return response.data.results || [];
};