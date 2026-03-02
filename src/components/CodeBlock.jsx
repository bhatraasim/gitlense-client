const CodeBlock = ({ content, language = 'javascript' }) => {
    return (
        <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] my-4 text-sm font-mono overflow-auto">
            <div className="bg-white/5 px-4 py-2 text-xs text-slate-400 capitalize border-b border-white/5 flex justify-between">
                <span>{language}</span>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="hover:text-white transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                </button>
            </div>
            <div className="p-4 overflow-x-auto whitespace-pre">
                <code className="text-slate-300">
                    {content}
                </code>
            </div>
        </div>
    );
};

export default CodeBlock;
