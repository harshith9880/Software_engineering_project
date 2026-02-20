import { Newspaper, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-indigo-600 p-1 rounded text-white">
                                <Newspaper size={20} />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">NewsHive</span>
                        </div>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Your personalized news aggregation system. Stay informed with real-time headlines and AI-powered insights tailored just for you.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-gray-600 hover:text-indigo-600 text-sm">Home</a></li>
                            <li><a href="/feed" className="text-gray-600 hover:text-indigo-600 text-sm">Personalized Feed</a></li>
                            <li><a href="/chatbot" className="text-gray-600 hover:text-indigo-600 text-sm">AI Assistant</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Terms of Service</a></li>
                            <li><a href="/about" className="text-gray-600 hover:text-indigo-600 text-sm">About Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} NewsHive. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <span>Powered by AI & NewsAPI</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
