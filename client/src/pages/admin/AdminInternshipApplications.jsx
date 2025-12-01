import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

const AdminInternshipApplications = () => {
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Internship Applicants</h1>
                <p className="text-gray-500 mt-1">Review and manage applications for this internship.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Student</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Applied Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map(app => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{app.student.name}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {app.student.email}
                                                </div>
                                                {app.student.profile?.resume && (
                                                    <a
                                                        href={`http://localhost:5000/${app.student.profile.resume}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                                                    >
                                                        View Resume
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${app.status === 'hired' ? 'bg-green-100 text-green-800 border-green-200' :
                                                app.status === 'selected_pending_payment' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                {app.status === 'hired' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {app.status === 'selected_pending_payment' && <Clock className="w-3 h-3 mr-1" />}
                                                {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                                {app.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                <span className="capitalize">{app.status === 'selected_pending_payment' ? 'Selected (Pending Payment)' : app.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'selected_pending_payment')}
                                                        className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        title="Select for Hiring"
                                                    >
                                                        Select for Hiring
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
                                                <span className="text-sm text-gray-400 italic">No actions</span>
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

export default AdminInternshipApplications;
