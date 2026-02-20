import { User, Bot } from 'lucide-react';

const ChatBubble = ({ message, isBot = false, timestamp = new Date() }) => {
    const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end animate-in slide-in-from-right duration-300'}`}>
            <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${isBot ? 'bg-indigo-600 text-white mr-3' : 'bg-white text-indigo-600 ml-3 border border-gray-100'
                    }`}>
                    {isBot ? <Bot size={22} /> : <User size={22} />}
                </div>

                <div className="flex flex-col">
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isBot
                            ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                            : 'bg-indigo-600 text-white rounded-tr-none'
                        }`}>
                        {message}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1.5 font-medium ${isBot ? 'text-left' : 'text-right'}`}>
                        {timeStr}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
