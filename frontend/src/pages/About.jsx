import { Newspaper, Users, Zap, Github, Globe, ShieldCheck } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gray-50 py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center text-indigo-600 font-bold px-3 py-1 bg-indigo-50 rounded-full text-xs uppercase tracking-widest mb-6">
                        The NewsHive Story
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8">
                        Reinventing How You <br />
                        <span className="text-indigo-600">Consume the World</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                        Born from the need to escape information overload, NewsHive uses cutting-edge AI to filter the global noise into personal signals.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            In an era of endless scrolling and clickbait, NewsHive's mission is simple: to provide a clean, insightful, and highly personalized news experience that respects your time and interests.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            We leverage an intelligent hybrid acquisition model that combines official news APIs with dedicated scrapers, ensuring you never miss a beat—whether it's global politics or niche technology breakthroughs.
                        </p>

                        <div className="space-y-4">
                            {[
                                { label: 'Unbiased Aggregation', icon: <Globe size={20} /> },
                                { label: 'Privacy-First Experience', icon: <ShieldCheck size={20} /> },
                                { label: 'AI-Driven Summarization', icon: <Zap size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 text-gray-900 font-bold">
                                    <div className="text-indigo-600">{item.icon}</div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-indigo-100 rounded-3xl rotate-1"></div>
                        <img
                            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200"
                            className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                            alt="News backdrop"
                        />
                    </div>
                </div>
            </section>

            {/* Team/Open Source */}
            <section className="bg-gray-900 py-24 px-4 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Built for the Future</h2>
                        <p className="text-indigo-200 text-lg max-w-2xl mx-auto opacity-70">
                            NewsHive is a modern web application built with speed, accessibility, and user-experience at its core.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Performant Stack", desc: "Built with Vite, React, and Tailwind CSS for blistering fast load times." },
                            { title: "Smart Scrapers", desc: "Python-based scrapers that understand content context, not just text." },
                            { title: "Scalable Core", desc: "Designed to handle thousands of concurrent news feeds without lag." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                                <p className="text-indigo-100/60 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex flex-col items-center">
                        <a
                            href="#"
                            className="flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-indigo-50 transition-all"
                        >
                            <Github size={22} className="mr-3" />
                            Star us on GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
