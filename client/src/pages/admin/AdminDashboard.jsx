import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users,
    Building2,
    Briefcase,
    Award,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
    <div className="card p-6 hover:translate-y-[-4px] transition-all duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                {subValue && <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>}
            </div>
            <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-').replace('500', '50')} shadow-inner`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        ngos: 0,
        activeNgos: 0,
        pendingNgos: 0,
        opportunities: 0,
        internships: 0,
        certifications: 0,
        applications: 0,
        totalHours: 0
    });
    const [analytics, setAnalytics] = useState({
        monthly: [],
        roles: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/admin/analytics', { withCredentials: true })
                ]);

                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
                if (analyticsRes.data.success) {
                    setAnalytics(analyticsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total NGOs"
                    value={stats.ngos}
                    subValue={`${stats.activeNgos} Active · ${stats.pendingNgos} Pending`}
                    icon={Building2}
                    color="bg-green-500"
                />
                <StatCard
                    title="Opportunities"
                    value={stats.opportunities + stats.internships}
                    subValue={`${stats.opportunities} Vol · ${stats.internships} Intern`}
                    icon={Briefcase}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Applications"
                    value={stats.applications}
                    icon={FileText}
                    color="bg-pink-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 card p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Platform Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.monthly}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="ngos" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="applications" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">User Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.roles}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.roles.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Certifications Issued"
                    value={stats.certifications}
                    icon={Award}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Total Hours Logged"
                    value={stats.totalHours}
                    icon={Clock}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats.pendingNgos}
                    icon={AlertCircle}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${stats.revenue || 0}`}
                    icon={CheckCircle}
                    color="bg-emerald-500"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
