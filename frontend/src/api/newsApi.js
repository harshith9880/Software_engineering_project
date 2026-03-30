import axios from 'axios';

const AI_SERVICE_URL = 'http://localhost:8000';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
});

const aiApi = axios.create({
    baseURL: AI_SERVICE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// News related API calls
export const newsApi = {
    getTopHeadlines: (category = '') => {
        return api.get(`/news/top-headlines${category && category !== 'All' ? `?category=${category}` : ''}`);
    },
    searchNews: (query) => {
        return api.get(`/news/search?q=${encodeURIComponent(query)}`);
    },
    getPersonalizedFeed: (preferences) => {
        return api.post('/news/personalized', { preferences });
    },
};

// Chatbot related API calls
export const chatbotApi = {
    sendMessage: (message) => {
        return aiApi.post('/chat', { message });
    },
};

// Verification API
export const verifyApi = {
    verifyArticle: (article) => {
        return aiApi.post('/verify', {
            title: article.title || '',
            description: article.description || article.content || '',
            source: article.source_name || article.source?.name || '',
            publishedAt: article.pubDate || article.publishedAt || '',
            url: article.link || article.url || '',
        });
    },
};

// Analytics API
export const analyticsApi = {
    getStats: () => aiApi.get('/analytics'),
    getNotifications: () => aiApi.get('/notifications'),
};

export default api;
