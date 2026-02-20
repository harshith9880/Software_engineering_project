import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import { Send, Sparkles, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { chatbotApi } from '../api/newsApi';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your NewsHive AI Assistant. I can help you find news, summarize topics, or explore categories. What's on your mind today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    const suggestedPrompts = [
        "Show today's tech news",
        "Latest finance headlines",
        "Sport updates for this week",
        "What's happening in global politics?"
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = {
            id: Date.now(),
            text: input,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatbotApi.sendMessage(input);
            const botMsg = {
                id: Date.now() + 1,
                text: response.data.message,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);

        } catch (err) {
            console.error("Chatbot error", err);
            const errorMsg = {
                id: Date.now() + 1,
                text: "I'm having some trouble connecting to my knowledge base right now. Please try again in a moment, or check the latest feed!",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([messages[0]]);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
            <div className="max-w-4xl w-full mx-auto flex flex-col h-full shadow-2xl bg-white border-x border-gray-100">

                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900 sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">AI News Assistant</h2>
                            <div className="flex items-center text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                Online & Ready
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Clear conversation"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-6 scroll-smooth custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg.text} isBot={msg.isBot} timestamp={msg.timestamp} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-6 animate-pulse">
                            <div className="flex max-w-[80%] flex-row">
                                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-100 mr-3"></div>
                                <div className="px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Suggested Prompts */}
                {messages.length < 3 && !isLoading && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <Sparkles size={14} className="mr-2 text-indigo-500" />
                            Suggested Queries
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedPrompts.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(prompt); }}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all flex items-center"
                                >
                                    {prompt}
                                    <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`absolute right-3 p-2.5 rounded-xl transition-all ${!input.trim() || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                                }`}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <p className="text-[11px] text-gray-400 text-center mt-3 font-medium opacity-70">
                        AI can make mistakes. Verify important news headlines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
