import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Calendar, User, AlertCircle } from 'lucide-react';

const HoursApproval = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/ngo/hours');
            setLogs(res.data.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            await axios.patch(`/api/ngo/hours/${action}/${id}`);
            // Optimistic update
            setLogs(logs.map(log =>
                log._id === id ? { ...log, status: action === 'approve' ? 'approved' : 'rejected' } : log
            ));
        } catch (error) {
            console.error(`Error ${action}ing log:`, error);
            alert(`Failed to ${action} log`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Hours Approval</h1>
                <p className="text-slate-500 mt-1 text-lg">Review and verify student volunteering hours.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {logs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No hour logs found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Student</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Opportunity</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Hours</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {log.student?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{log.student?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{log.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-900 font-medium">{log.opportunity?.title}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{log.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-slate-900">{log.hours}</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(log.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${log.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                log.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(log._id, 'approve')}
                                                        disabled={actionLoading === log._id || log.status === 'approved'}
                                                        className={`p-2 rounded-lg transition-colors ${log.status === 'approved' ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(log._id, 'reject')}
                                                        disabled={actionLoading === log._id || log.status === 'rejected'}
                                                        className={`p-2 rounded-lg transition-colors ${log.status === 'rejected' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HoursApproval;
