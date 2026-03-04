import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { askQuestion } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
        return (
            <div className="relative group my-4 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Copy code"
                    >
                        <span className="material-symbols-outlined text-[14px]">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                        <span className="text-xs font-sans">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="!m-0 !bg-[#1e1e1e] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent custom-scrollbar max-w-full"
                    codeTagProps={{ className: 'font-mono text-[13px] leading-relaxed' }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        );
    }

    return (
        <code className={`${className} bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono break-words`} {...props}>
            {children}
        </code>
    );
};

const ChatInterface = () => {
    const { user, logout } = useAuth();
    const { repoId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Modal state for code sources
    const [selectedSource, setSelectedSource] = useState(null);

    useEffect(() => {
        // Welcome message
        setMessages([
            {
                role: 'ai',
                content: "Hello! I'm your GitLense AI assistant. Ask me anything about this repository's architecture, flow, or specific implementations."
            }
        ]);
    }, [repoId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        // Add to history
        const newMessages = [
            ...messages,
            { role: 'human', content: userMessage }
        ];
        setMessages(newMessages);
        setIsTyping(true);
        setError(null);

        try {
            // Prepare chat history payload (filter out initial welcome message if needed, or include it)
            const chatHistory = newMessages.slice(0, -1).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await askQuestion(userMessage, repoId, chatHistory);

            // Add AI response to history
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: response.answer,
                    sources: response.sources
                }
            ]);

        } catch (err) {
            setError(err.message || "Failed to get an answer from the AI.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-dark font-display text-white-text min-h-screen hero-gradient flex flex-col relative overflow-hidden">

            {/* Sidebar Toggle Checkbox Logic from design */}
            <input
                type="checkbox"
                id="sidebar-toggle"
                className="hidden peer"
                checked={sidebarOpen}
                onChange={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar Drawer */}
            <div className="fixed inset-y-0 left-0 z-[60] w-72 h-full transition-transform -translate-x-full peer-checked:translate-x-0 glass border-r border-primary/20 flex flex-col shadow-2xl overflow-hidden bg-[#0f1115]/95">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(234,164,19,0.4)]">visibility</span>
                        <h2 className="text-lg font-bold tracking-tight text-white-text">GitLense</h2>
                    </div>
                    <label htmlFor="sidebar-toggle" className="cursor-pointer p-1 rounded-md hover:bg-primary/10 text-slate-text">
                        <span className="material-symbols-outlined">close</span>
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <p className="px-2 py-2 text-xs font-semibold text-slate-text uppercase tracking-wider mb-2">Back to Repos</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center justify-start gap-3 p-3 rounded-lg bg-primary/10 text-primary border-l-2 border-primary hover:bg-primary/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">grid_view</span>
                        <span className="text-sm">Dashboard</span>
                    </button>

                    <p className="px-2 py-2 mt-4 text-xs font-semibold text-slate-text uppercase tracking-wider mb-2">Current Repository</p>
                    <div className="px-3 py-2 text-sm text-slate-300 break-words opacity-70">
                        {repoId}
                    </div>
                </div>

                <div className="p-4 border-t border-primary/10 space-y-2">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg text-slate-text hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm">Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg text-rose-500/80 hover:bg-rose-500/5 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay */}
            <label
                htmlFor="sidebar-toggle"
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] hidden peer-checked:block transition-all"
            ></label>

            {/* Main Application Container */}
            <div className="max-w-5xl mx-auto flex flex-col h-screen w-full relative z-10 transition-all duration-300">

                {/* Header */}
                <header className="flex items-center justify-between p-4 glass border-b border-primary/10 bg-[#0f1115]/80 backdrop-blur-md sticky top-0">
                    <div className="flex items-center gap-3">
                        <label htmlFor="sidebar-toggle" className="p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-primary">menu</span>
                        </label>
                        <h2 className="text-xl font-bold tracking-tight text-white-text hidden sm:flex items-center">
                            <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(234,164,19,0.4)] mr-1.5 align-middle">visibility</span>
                            GitLense
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-400 hidden sm:block truncate max-w-[200px] border border-white/10 px-3 py-1 rounded-full bg-white/5">
                            {repoId}
                        </div>
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <main className="flex-1 overflow-y-auto flex flex-col p-4 sm:p-6 space-y-6">

                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 max-w-[90%] sm:max-w-[85%] ${msg.role === 'human' ? 'self-end flex-row-reverse' : ''}`}>

                            {/* Avatar */}
                            {msg.role === 'ai' ? (
                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                                </div>
                            ) : (
                                <div className="size-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg glow-primary">
                                    <span className="material-symbols-outlined text-background-dark text-lg">person</span>
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={`p-4 rounded-2xl shadow-sm overflow-hidden ${msg.role === 'human'
                                    ? 'bg-primary text-background-dark rounded-tr-none font-medium'
                                    : 'glass rounded-tl-none border border-primary/10 flex-1 min-w-0'
                                }`}>
                                {msg.role === 'human' ? (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-background-dark break-words">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <div className="text-sm leading-relaxed text-slate-300 markdown-body break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code: CodeBlock,
                                                p: ({ node, ...props }) => <p className="mb-4 last:mb-0 break-words" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1 block" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1 block" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-4 mt-6 text-white" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-5 text-white" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-3 mt-4 text-white" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-primary hover:text-amber-400 hover:underline transition-colors break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/40 pl-4 py-1.5 my-4 bg-primary/5 rounded-r" {...props} />,
                                                table: ({ node, ...props }) => <div className="overflow-x-auto mb-4 border border-white/10 rounded-lg"><table className="w-full text-left border-collapse" {...props} /></div>,
                                                th: ({ node, ...props }) => <th className="border-b border-white/10 bg-white/5 p-3 text-slate-200 font-semibold" {...props} />,
                                                td: ({ node, ...props }) => <td className="border-b border-white/5 p-3 text-slate-300" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* Citations / Sources */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Citations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.map((source, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedSource(source)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/30 rounded-lg transition-all text-xs text-slate-400 hover:text-primary group"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">description</span>
                                                    <span className="truncate max-w-[150px]">{source.file_path.split('/').pop()}</span>
                                                    <span className="opacity-50 group-hover:opacity-100">L{source.chunk_index}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading State */}
                    {isTyping && (
                        <div className="flex items-start gap-3 max-w-[85%] opacity-50">
                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-lg animate-pulse">smart_toy</span>
                            </div>
                            <div className="glass p-4 rounded-2xl rounded-tl-none border border-primary/10 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-3 max-w-[85%] mt-4">
                            <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl rounded-tl-none">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </main>

                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-[#0f1115]/80 backdrop-blur-md border-t border-white/5 sticky bottom-0">
                    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2 glass rounded-full p-1.5 border border-primary/20 shadow-inner group focus-within:ring-2 focus-within:ring-primary/30 transition-all bg-[#1a1c1e]/80">
                        <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors cursor-not-allowed">
                            <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isTyping}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-200 placeholder-slate-500 outline-none"
                            placeholder={isTyping ? "GitLense is analyzing..." : "Ask me anything about the codebase..."}
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !input.trim()}
                            className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Code Preview Modal mapping from `repo_browser_with_code_preview` HTML */}
            {selectedSource && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
                    <div className="w-full max-w-3xl bg-[#1a1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-100">{selectedSource.file_path.split('/').pop()}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-sm">
                                        {selectedSource.file_path} • Chunk {selectedSource.chunk_index}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedSource(null)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Content Area - Simulated code chunk view */}
                        <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed scrollbar-thin">
                            <div className="bg-primary/5 border-l-2 border-primary -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center mb-4 text-xs text-primary/70 uppercase tracking-widest font-bold">
                                    <span>Relevance Score: {(selectedSource.score * 100).toFixed(1)}%</span>
                                </div>
                                <pre className="text-slate-300 whitespace-pre-wrap break-words">
                                    <code>
                                        {/* Since actual chunks aren't returned currently, map something representative */}
                                        // Content extracted from {selectedSource.file_path} at chunk {selectedSource.chunk_index}
                                        // The backend RAG model utilized this code sequence to generate the answer.
                                    </code>
                                </pre>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedSource(null)}
                                className="px-6 py-2.5 bg-primary text-[#0f1115] text-xs font-bold rounded-lg hover:bg-amber-400 shadow-lg shadow-primary/20 transition-all"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
