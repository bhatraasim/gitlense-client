import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <nav className="fixed top-0 w-full z-50 glass border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <span className="material-symbols-outlined text-background-dark font-bold">account_tree</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-white-text">GitLense</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white-text/70">
                        <a className="hover:text-primary transition-colors" href="#">Product</a>
                        <a className="hover:text-primary transition-colors" href="#">Solutions</a>
                        <a className="hover:text-primary transition-colors" href="#">Enterprise</a>
                        <a className="hover:text-primary transition-colors" href="#">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to="/dashboard" className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold glow-primary hover:brightness-110 transition-all">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold px-4 py-2 text-white-text hover:text-primary transition-colors">Sign In</Link>
                                <Link to="/register" className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold glow-primary hover:brightness-110 transition-all">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden dark:bg-background-dark hero-gradient">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="flex flex-col gap-8">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-primary text-xs font-bold tracking-widest uppercase">Powered by GPT-4o</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white-text">
                            Visualize your code through the <span className="font-serif italic text-primary">lens of AI</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white-text/70 max-w-xl leading-relaxed">
                            Transform complex microservices and legacy architectures into elegant, actionable visual insights with our deep-learning analysis engine.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to={user ? "/dashboard" : "/register"} className="bg-primary text-background-dark px-8 py-4 rounded-xl text-lg font-bold glow-primary hover:scale-105 transition-all flex items-center gap-2">
                                Try for Free
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <button className="glass px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/5 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">play_circle</span>
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all duration-700"></div>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 glass p-2">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_ud12FOV0WudrOjLHo4jhccLP-2AYjr-x9ZISldJlKfjjK3kGUIJCBMpACycWz015cEqzBYFYR6tgcv9wlfdGqs-S2bsflU6XFbKFHNrbJ-X2TayYElsKmcSN-JKT8cwl-DFuE5WLqIl4H2aMH5Sd4lg15Lxj5e72NGor1J6Itvj4vNoa2xW1OjN8F6odsxKgjsObSkk5aa3gjIK_rCZQuqVLw6j-jzOrXxub16E_I6TGvV04QdxSMpojXdDn0M9lPs3nKifqShY"
                                alt="Code visualization interface"
                                className="rounded-xl w-full h-auto opacity-90 grayscale-[0.2] brightness-75"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="size-20 glass rounded-full flex items-center justify-center border border-primary/40 text-primary">
                                    <span className="material-symbols-outlined text-4xl">insights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 border-y border-primary/5 bg-background-light dark:bg-[#0d0b08]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-slate-400 dark:text-primary/60 mb-12">
                        Trusted by engineering teams at
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 text-white-text/80">
                        <span className="text-2xl font-black italic">LINEAR</span>
                        <span className="text-2xl font-black italic">VERCEL</span>
                        <span className="text-2xl font-black italic">STRIPE</span>
                        <span className="text-2xl font-black italic">GITHUB</span>
                        <span className="text-2xl font-black italic">SCALE</span>
                    </div>
                </div>
            </section>

            <section className="py-32 relative overflow-hidden bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white-text">Engineering Intelligence</h2>
                        <p className="text-lg md:text-xl text-white-text/70 max-w-xl leading-relaxed mx-auto">Beyond syntax highlighting. Understand the intent, flow, and future of your codebase with AI that thinks like an architect.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass p-8 rounded-2xl group hover:border-primary/40 transition-all">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">hub</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white-text">Neural Mapping</h3>
                            <p className="text-lg md:text-xl text-white-text/70 max-w-xl leading-relaxed">Trace logic across complex microservices with AI-powered visual graphs that update in real-time.</p>
                        </div>
                        <div className="glass p-8 rounded-2xl group hover:border-primary/40 transition-all border-primary/30">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">architecture</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white-text">Instant Architecture</h3>
                            <p className="text-lg md:text-xl text-white-text/70 max-w-xl leading-relaxed">Generate high-fidelity C4 system diagrams directly from your repository with one click.</p>
                        </div>
                        <div className="glass p-8 rounded-2xl group hover:border-primary/40 transition-all">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">auto_stories</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white-text">Automated Docs</h3>
                            <p className="text-lg md:text-xl text-white-text/70 max-w-xl leading-relaxed">Keep your technical documentation in sync with every commit, generated automatically by LLMs.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-background-light dark:bg-[#0d0b08] py-20 border-t border-primary/10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-1 rounded">
                                <span className="material-symbols-outlined text-background-dark text-sm font-bold">account_tree</span>
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-white-text">GitLense</span>
                        </div>
                        <p className="text-sm text-white-text/50 leading-relaxed">The AI architecture layer for modern development teams. Insight at the speed of thought.</p>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-white-text">Product</h5>
                        <ul className="space-y-4 text-sm text-white-text/50">
                            <li><a href="#" className="hover:text-primary transition-colors">Visualizer</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Neural Mapping</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Auto-Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-white-text">Company</h5>
                        <ul className="space-y-4 text-sm text-white-text/50">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
