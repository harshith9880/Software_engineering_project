import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// News related API calls
export const newsApi = {
    getTopHeadlines: (category = '') => {
        return api.get(`/news/top-headlines${category ? `?category=${category}` : ''}`);
    },
    searchNews: (query) => {
        return api.get(`/news/search?q=${query}`);
    },
    getPersonalizedFeed: (preferences) => {
        return api.post('/news/personalized', { preferences });
    },
};

// Chatbot related API calls
export const chatbotApi = {
    sendMessage: (message) => {
        return api.post('/chatbot/chat', { message });
    },
};

export default api;
