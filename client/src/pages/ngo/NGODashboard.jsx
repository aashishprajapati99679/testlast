import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, ArrowRight, TrendingUp, Activity } from 'lucide-react';

const NGODashboard = () => {
    const [activeTab, setActiveTab] = useState('volunteering');
    const [stats, setStats] = useState({ activeOpportunities: 0, totalApplications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/ngo/stats');
                setStats(data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Active Opportunities',
            value: stats.activeOpportunities,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: 'Live now'
        },
        {
            label: 'Total Applications',
            value: stats.totalApplications,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: 'All time'
        },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">NGO Dashboard</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Overview of your posted opportunities and applicant engagement.</p>
                </div>
                <Link
                    to="/ngo/opportunities/create"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <PlusCircle className="w-5 h-5" />
                    Post Opportunity
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card p-6 hover:translate-y-[-4px] transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} shadow-inner`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-800 mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    );
                })}

                <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-slate-900 z-0"></div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2 tracking-tight">Grow your impact</h3>
                            <p className="text-primary-100 text-sm leading-relaxed">Post more opportunities to reach a wider audience of student volunteers.</p>
                        </div>
                        <Link to="/ngo/opportunities/create" className="inline-flex items-center text-sm font-bold text-white hover:text-primary-200 mt-4 group-hover:translate-x-1 transition-transform">
                            Get Started <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                    <button className="text-sm text-primary-600 font-bold hover:text-primary-700 hover:underline decoration-2 underline-offset-4 transition-all">View All</button>
                </div>
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                        <Activity className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No recent activity</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Activities will appear here once you start receiving applications.</p>
                </div>
            </div>
        </div>
    );
};

export default NGODashboard;
