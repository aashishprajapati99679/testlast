import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Plus, History } from 'lucide-react';
import HourPackageCard from '../../components/student/HourPackageCard';

const HoursTracking = () => {
    const location = useLocation();
    const [logs, setLogs] = useState([]);
    const [acceptedApps, setAcceptedApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [packageStatus, setPackageStatus] = useState(null);
    const [formData, setFormData] = useState({
        opportunityId: location.state?.opportunityId || '',
        date: '',
        hours: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsRes, appsRes] = await Promise.all([
                axios.get('/api/student/hours'),
                axios.get('/api/student/applications')
            ]);
            setLogs(logsRes.data.data);
            const accepted = appsRes.data.data.filter(app => app.status === 'accepted' && app.opportunity);
            setAcceptedApps(accepted);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/student/hours', formData);
            setFormData({ opportunityId: '', date: '', hours: '', description: '' });
            fetchData(); // Refresh list
            // Refresh package status via callback if possible, or just let the user refresh
            // Ideally pass a refresh trigger to HourPackageCard or lift state up.
            // For now, we rely on the backend check and user can refresh page or we trigger a re-fetch of package if we had access to it.
            // A simple alert is fine.
            alert('Hours logged successfully!');
            window.location.reload(); // Simple way to refresh package card
        } catch (error) {
            console.error('Error logging hours:', error);
            if (error.response?.data?.code === 'PACKAGE_EXHAUSTED') {
                alert('You have exhausted your hour package. Please purchase more hours.');
            } else {
                alert(error.response?.data?.message || 'Failed to log hours');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const stats = {
        total: Array.isArray(logs) ? logs.reduce((acc, log) => acc + (log.status === 'approved' ? log.hours : 0), 0) : 0,
        pending: Array.isArray(logs) ? logs.reduce((acc, log) => acc + (log.status === 'pending' ? log.hours : 0), 0) : 0,
        rejected: Array.isArray(logs) ? logs.reduce((acc, log) => acc + (log.status === 'rejected' ? log.hours : 0), 0) : 0,
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    const isPackageActive = packageStatus?.status === 'active';
    const hasBalance = packageStatus ? (packageStatus.totalHours - packageStatus.hoursUsed) > 0 : false;
    const canLog = isPackageActive && hasBalance;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Hours Tracking</h1>
                <p className="text-slate-500 mt-1 text-lg">Log your volunteering hours and track your impact.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Package & Form */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Hour Package Card */}
                    <HourPackageCard onPackageUpdate={setPackageData => setPackageStatus(setPackageData)} />

                    {/* Log Hours Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary-600" />
                                Log New Hours
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {!canLog && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>You need an active hour package with sufficient balance to log hours.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Opportunity</label>
                                <select
                                    required
                                    disabled={!canLog}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                    value={formData.opportunityId}
                                    onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
                                >
                                    <option value="">Select Opportunity</option>
                                    {acceptedApps.map(app => (
                                        <option key={app.opportunity?._id} value={app.opportunity?._id}>
                                            {app.opportunity?.title || 'Unknown Opportunity'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    disabled={!canLog}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Hours</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    required
                                    disabled={!canLog}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                    value={formData.hours}
                                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    disabled={!canLog}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400"
                                    placeholder="What did you do?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || acceptedApps.length === 0 || !canLog}
                                className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                {submitting ? 'Submitting...' : 'Submit Log'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Stats & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-500 font-medium">Approved</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stats.total}h</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-500 font-medium">Pending</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stats.pending}h</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                    <XCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-500 font-medium">Rejected</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stats.rejected}h</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-400" />
                                History
                            </h3>
                        </div>

                        {logs.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>No hours logged yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <div key={log._id} className="p-6 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{log.opportunity.title}</h4>
                                                <p className="text-sm text-slate-500">{log.opportunity.organization?.name || 'Organization'}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${log.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                log.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            "{log.description}"
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(log.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {log.hours} Hours
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoursTracking;
