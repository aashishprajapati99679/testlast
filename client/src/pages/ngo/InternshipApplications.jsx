import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

const InternshipApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await axios.get(`/api/internships/${id}/applicants`);
                setApplications(data.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axios.put(`/api/internships/applications/${appId}/status`, { status: newStatus });
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Internship Applicants</h1>
                <p className="text-slate-500 mt-1">Review and manage applications for this internship.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Student</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Applied Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{app.student.name}</p>
                                                <div className="flex items-center text-sm text-slate-500">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {app.student.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${app.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                {app.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                                {app.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                <span className="capitalize">{app.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Accept"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InternshipApplications;
