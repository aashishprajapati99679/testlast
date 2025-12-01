import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileCheck,
    LogOut,
    Briefcase,
    CreditCard,
    Building2,
    GraduationCap,
    FileText,
    BarChart3,
    LifeBuoy,
    Settings,
    Menu
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const active = isActive(to);
        return (
            <Link
                to={to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
                    ? 'bg-white/60 text-primary-600 shadow-sm border border-white/50 backdrop-blur-sm'
                    : 'hover:bg-white/40 hover:text-slate-900 text-slate-500 hover:translate-x-1'
                    }`}
            >
                <Icon size={20} className={`transition-colors duration-300 ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <span className="font-medium">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
            </Link>
        );
    };

    return (
        <div className="flex h-screen font-sans bg-slate-50/50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 glass-sidebar flex flex-col h-full shadow-soft transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
            `}>
                <div className="p-6 border-b border-white/40 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">GETSERVE</h1>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Admin Portal</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/50 text-slate-500"
                    >
                        <LogOut size={20} className="rotate-180" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar space-y-1 px-2">
                    <div className="px-4 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Overview</div>
                    <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics & Reports" />

                    <div className="px-4 mt-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Management</div>
                    <NavItem to="/admin/verify-ngos" icon={FileCheck} label="Verify NGOs" />
                    <NavItem to="/admin/ngos" icon={Building2} label="NGOs" />
                    <NavItem to="/admin/students" icon={GraduationCap} label="Students" />
                    <NavItem to="/admin/opportunities" icon={Briefcase} label="Opportunities" />
                    <NavItem to="/admin/internships" icon={Briefcase} label="Internships" />
                    <NavItem to="/admin/certifications" icon={FileCheck} label="Certifications" />

                    <div className="px-4 mt-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Operations</div>
                    <NavItem to="/admin/applications" icon={FileText} label="Applications" />
                    <NavItem to="/admin/payments" icon={CreditCard} label="Payments" />
                    <NavItem to="/admin/support" icon={LifeBuoy} label="Support & Tickets" />
                    <NavItem to="/admin/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/40">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50/50 hover:text-red-600 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-red-100">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-0 w-full">
                {/* Topbar */}
                <header className="glass-sidebar border-b border-white/40 shadow-sm h-20 flex items-center justify-between px-4 lg:px-8 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/50 text-slate-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
                            {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200/50">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-md">
                                A
                            </div>
                            <span className="text-sm font-bold text-slate-700 hidden sm:inline">Admin User</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 lg:p-8 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
