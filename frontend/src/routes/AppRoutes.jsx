import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import Preferences from '../pages/Preferences';
import Article from '../pages/Article';
import Chatbot from '../pages/Chatbot';
import Admin from '../pages/Admin';
import About from '../pages/About';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
