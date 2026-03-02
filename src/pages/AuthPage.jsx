import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ isLogin: initialIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Sync with router changes
    React.useEffect(() => {
        setIsLogin(location.pathname === '/login');
        setError('');
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name) {
                    setError("Name is required for registration.");
                    setLoading(false);
                    return;
                }
                await register(name, email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-background-dark text-white-text min-h-screen flex items-center justify-center p-4 selection:bg-primary/30 hero-gradient relative z-0">
            {/* Background Decoration */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10"></div>

            {/* Auth Container */}
            <div className="w-full max-w-md glass shadow-2xl rounded-2xl overflow-hidden border border-white/10 z-10 bg-[#111111]/80 backdrop-blur-md">
                {/* Header / Logo */}
                <div className="p-8 pb-4 text-center">
                    <Link to="/" className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 shadow-inner hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-primary text-5xl">visibility</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">GitLense</h2>
                    <p className="mt-2 text-slate-400 font-medium">Advanced Insights for your Repositories</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[12px] text-primary">psychology</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Powered Workflow</span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="px-8 pb-8">
                    <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
                        <Link
                            to="/login"
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg text-center transition-all ${isLogin ? 'bg-zinc-800 shadow-sm text-white border border-white/10' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg text-center transition-all ${!isLogin ? 'bg-zinc-800 shadow-sm text-white border border-white/10' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Sign Up
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-500 text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Email address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-500 text-white"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-300">Password</label>
                                {isLogin && <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80">Forgot password?</a>}
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-500 text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        {isLogin && (
                            <div className="flex items-center pt-2">
                                <input id="remember" type="checkbox" className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary bg-transparent focus:ring-primary/30" />
                                <label htmlFor="remember" className="ml-2 block text-sm text-slate-400">Keep me signed in</label>
                            </div>
                        )}


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:brightness-110 text-background-dark font-bold py-3.5 rounded-xl transition-all duration-200 glow-primary mt-4 active:scale-[0.98] text-sm tracking-wide disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Link to={isLogin ? "/register" : "/login"} className="font-bold text-primary hover:underline underline-offset-4">
                            {isLogin ? "Create account" : "Sign in"}
                        </Link>
                    </p>
                </div>
                {/* Footer Accent */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>

        </div>
    );
};

export default AuthPage;
