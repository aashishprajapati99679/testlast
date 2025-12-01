import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, PlusCircle, List, FileBarChart, LogOut, Building2, Clock, MessageSquare } from 'lucide-react';

const NGOLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
        { label: 'Post Opportunity', path: '/ngo/opportunities/create', icon: PlusCircle },
        { label: 'My Opportunities', path: '/ngo/opportunities', icon: List },
        { label: 'Hours Approval', path: '/ngo/hours', icon: Clock },
        { label: 'Support', path: '/ngo/support', icon: MessageSquare },
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen font-sans bg-slate-50/50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 glass-sidebar flex flex-col transition-transform duration-300 ease-in-out shadow-soft
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
            `}>
                <div className="p-6 border-b border-white/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            G
                        </div>
                        <h3 className="text-slate-800 text-xl font-heading font-bold tracking-tight">GETSERVE</h3>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/50 text-slate-500"
                    >
                        <LogOut size={20} className="rotate-180" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-2">NGO Portal</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-white/60 text-primary-600 shadow-sm border border-white/50 backdrop-blur-sm'
                                    : 'hover:bg-white/40 hover:text-slate-900 text-slate-500 hover:translate-x-1'
                                    }`}
                            >
                                <Icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
                            </Link>
                        );
                    })}

                    <div className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Analytics</div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed opacity-60">
                        <FileBarChart size={20} />
                        <span className="font-medium">Reports</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/40">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-red-100"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative z-10 w-full">
                <header className="h-20 glass-sidebar border-b border-white/40 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/50 text-slate-600 transition-colors"
                        >
                            <List size={24} />
                        </button>
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200/50">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                <p className="text-xs text-slate-500 capitalize flex items-center justify-end gap-1 font-medium">
                                    <Building2 className="w-3 h-3" /> NGO Partner
                                </p>
                            </div>
                            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default NGOLayout;
