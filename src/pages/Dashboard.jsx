import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllRepos, ingestRepo, checkRepoStatus } from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ingestion State
    const [isIngesting, setIsIngesting] = useState(false);
    const [newRepoUrl, setNewRepoUrl] = useState('');
    const [ingestModalOpen, setIngestModalOpen] = useState(false);

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        try {
            setLoading(true);
            const data = await getAllRepos();
            setRepos(data);
        } catch (err) {
            setError(err.message || 'Failed to load repositories');
        } finally {
            setLoading(false);
        }
    };

    // Polling mechanism for a specific repo
    const pollRepoStatus = async (repoId) => {
        try {
            const statusData = await checkRepoStatus(repoId);

            // Update the specific repo in state
            setRepos(prevRepos =>
                prevRepos.map(repo =>
                    repo.id === repoId || repo._id === repoId
                        ? { ...repo, status: statusData.repo_status }
                        : repo
                )
            );

            if (statusData.repo_status === 'ready' || statusData.repo_status === 'failed') {
                return statusData; // Polling finished
            } else {
                // Continue checking every 3 seconds
                setTimeout(() => pollRepoStatus(repoId), 3000);
            }
        } catch (err) {
            console.error("Polling error:", err);
        }
    };

    const handleIngest = async (e) => {
        e.preventDefault();
        setError('');
        if (!newRepoUrl) return;

        setIsIngesting(true);
        try {
            const result = await ingestRepo(newRepoUrl);
            setIngestModalOpen(false);
            setNewRepoUrl('');

            // Re-fetch to show the new item, then start polling its status
            await fetchRepos();
            pollRepoStatus(result.repo_id);

        } catch (err) {
            setError(err.message || 'Failed to ingest repository');
        } finally {
            setIsIngesting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChatClick = (repo) => {
        // Assuming repo _id is the identifier
        const repoId = repo._id || repo.id;
        navigate(`/chat/${repoId}`);
    };

    return (
        <div className="bg-[#0f1115] text-slate-100 min-h-screen flex flex-col font-display">
            {/* Header / Nav */}
            <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0f1115]/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-background-dark text-2xl font-bold">account_tree</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-100">GitLense</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 hover:text-primary">notifications</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <span className="material-symbols-outlined text-primary">person</span>
                            </div>
                            <span className="text-sm font-medium hidden sm:block text-slate-300">{user?.name}</span>
                            <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white ml-2">Logout</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Search and Filters Section */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-white placeholder-slate-500"
                                placeholder="Search repositories..."
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-[#0f1115] rounded-xl font-medium shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-sm">filter_list</span>
                                <span>All Repos</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition-colors">
                                <span>Ready</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl font-medium hover:bg-slate-700 transition-colors">
                                <span>Processing</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center">
                            Connected Repositories
                            <span className="ml-3 px-2.5 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">
                                {repos.length} Total
                            </span>
                        </h2>
                        <button
                            onClick={() => setIngestModalOpen(true)}
                            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
                        >
                            <span className="material-symbols-outlined text-sm">add</span> Connect New Repo
                        </button>
                    </div>

                    {/* Repo Cards Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {repos.map((repo) => {
                                const isReady = repo.status === 'ready';
                                const isProcessing = ['queued', 'cloning', 'parsing', 'embedding'].includes(repo.status);
                                const isFailed = repo.status === 'failed';
                                const displayRepoName = repo.repo_name || (repo.repo_url ? repo.repo_url.split('/').pop() : 'Unknown Repository');
                                const displayRepoPath = repo.repo_url ? repo.repo_url.replace('https://github.com/', '') : '';

                                return (
                                    <div key={repo._id || repo.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group shadow-xl relative overflow-hidden">

                                        {/* Progress indicator at top edge if processing */}
                                        {isProcessing && (
                                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                                <div className="h-full bg-primary/70 rounded-r-full animate-pulse w-2/3"></div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3 max-w-[70%]">
                                                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/10 text-slate-300 border border-white/10 shrink-0">
                                                    <span className="material-symbols-outlined text-slate-300">folder_data</span>
                                                </div>
                                                <div className="truncate">
                                                    <h3 className="font-bold text-slate-100 group-hover:text-primary transition-colors truncate" title={displayRepoName}>
                                                        {displayRepoName}
                                                    </h3>
                                                    <p className="text-[10px] text-slate-500 truncate" title={repo.repo_url}>{displayRepoPath}</p>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            {isReady && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-green-500/20 text-green-400 border border-green-500/30">Ready</span>}
                                            {isProcessing && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">{repo.status}</span>}
                                            {isFailed && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-red-500/20 text-red-400 border border-red-500/30">Failed</span>}
                                        </div>

                                        <div className="mb-5">
                                            <p className="text-sm text-slate-400">
                                                Files Processed: <span className="font-bold text-slate-200">{repo.file_count || 0}</span>
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                Chunks Embedded: <span className="font-bold text-slate-200">{repo.chunk_count || 0}</span>
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                disabled={!isReady}
                                                onClick={() => handleChatClick(repo)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${isReady ? 'text-[#0f1115] bg-primary hover:brightness-110' : 'text-slate-500 bg-white/5 cursor-not-allowed border border-white/10'}`}
                                            >
                                                <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                                Chat
                                            </button>
                                            <button
                                                disabled={!isReady}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${isReady ? 'text-slate-300 bg-slate-800 border border-white/10 hover:bg-white/10' : 'text-slate-600 bg-transparent border border-white/5 cursor-not-allowed'}`}
                                            >
                                                <span className="material-symbols-outlined text-sm">analytics</span>
                                                Insights
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State / Add New */}
                            <div
                                onClick={() => setIngestModalOpen(true)}
                                className="border-2 border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white/5 transition-all group cursor-pointer min-h-[220px]"
                            >
                                <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add</span>
                                </div>
                                <h3 className="font-bold text-slate-400 group-hover:text-slate-300">Connect Repository</h3>
                                <p className="text-xs text-slate-500 mt-1">Import from GitHub</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Ingestion Modal overlay */}
                {ingestModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1a160f] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                            <div className="flex justify-between items-center p-6 border-b border-white/5">
                                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">add_link</span>
                                    Connect Repository
                                </h3>
                                <button onClick={() => setIngestModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Enter a public GitHub repository URL to start the deep-learning analysis process. GitLense will clone, parse, and embed the codebase into our vector store.
                                </p>
                                <form onSubmit={handleIngest} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">GitHub URL</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">link</span>
                                            <input
                                                type="url"
                                                required
                                                value={newRepoUrl}
                                                onChange={(e) => setNewRepoUrl(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white"
                                                placeholder="https://github.com/facebook/react"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            disabled={isIngesting}
                                            type="button"
                                            onClick={() => setIngestModalOpen(false)}
                                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isIngesting}
                                            type="submit"
                                            className="bg-primary hover:brightness-110 text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold glow-primary transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isIngesting ? (
                                                <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Ingesting...</>
                                            ) : (
                                                'Start Ingestion'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Navigation Bar */}
            <nav className="sticky bottom-0 z-10 border-t border-white/5 bg-[#0f1115]/90 backdrop-blur-xl px-4 pb-4 pt-2">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-primary">
                        <span className="material-symbols-outlined">grid_view</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Repos</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-not-allowed">
                        <span className="material-symbols-outlined">insights</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Insights</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-not-allowed">
                        <span className="material-symbols-outlined">forum</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Chat</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-not-allowed">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Dashboard;
