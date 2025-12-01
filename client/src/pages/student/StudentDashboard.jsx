import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Clock, Award, TrendingUp, Activity, Calendar } from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ applications: 0, hours: 0, certificates: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/student/stats');
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
            label: 'Total Applications',
            value: stats.applications,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+12% from last month'
        },
        {
            label: 'Volunteering Hours',
            value: stats.hours,
            icon: Clock,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+5.2 hrs this week'
        },
        {
            label: 'Certificates Earned',
            value: stats.certificates,
            icon: Award,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: '2 pending approval'
        },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2 text-lg font-medium">Welcome back! Here's what's happening with your journey.</p>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card p-6 hover:translate-y-[-4px] transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} shadow-inner`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-100">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-800 mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Activity className="w-5 h-5 text-slate-600" />
                            </div>
                            Recent Activity
                        </h3>
                        <button className="text-sm text-primary-600 font-bold hover:text-primary-700 hover:underline decoration-2 underline-offset-4 transition-all">View All</button>
                    </div>

                    <div className="space-y-8">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center z-10 relative group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-5 h-5 text-primary-500" />
                                    </div>
                                    {i !== 2 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100 -z-0"></div>}
                                </div>
                                <div className="pt-1">
                                    <p className="text-slate-800 font-bold text-lg group-hover:text-primary-600 transition-colors">Applied for "Beach Cleanup Drive"</p>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">2 days ago • Environmental Cause</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 z-0"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/40 transition-all duration-700"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold mb-3 tracking-tight">Complete your profile</h3>
                            <p className="text-primary-100 mb-8 max-w-md text-lg leading-relaxed">
                                Adding more details to your profile increases your chances of getting selected for volunteering opportunities.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/student/profile')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default StudentDashboard;
