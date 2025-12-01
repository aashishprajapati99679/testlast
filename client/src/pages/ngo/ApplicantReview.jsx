import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail, User, Book, Calendar, Award } from 'lucide-react';

const ApplicantReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/ngo/opportunities/${id}/applications`);
            setApplications(data.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/ngo/applications/${appId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleIssueCertificate = async (studentId) => {
        if (!window.confirm('Are you sure you want to issue a certificate? This will calculate total approved hours and email the certificate to the student.')) {
            return;
        }
        try {
            const res = await axios.post(
                'http://localhost:5000/api/ngo/certificate/issue',
                { studentId, opportunityId: id },
                { withCredentials: true }
            );
            alert(res.data.message);
        } catch (error) {
            console.error('Error issuing certificate:', error);
            alert(error.response?.data?.message || 'Failed to issue certificate');
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
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Opportunities
                </button>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Applicant Review</h1>
                <p className="text-slate-500 mt-1 text-lg">Review and manage applications for this opportunity.</p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
                    <p className="text-slate-500 mt-1">Wait for students to apply to this opportunity.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Student Details</th>
                                    <th className="px-6 py-4">Skills & Education</th>
                                    <th className="px-6 py-4">Applied On</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                                                    {app.student?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{app.student?.name}</div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {app.student?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm text-slate-700 flex items-center gap-1.5">
                                                    <Book className="w-3 h-3 text-slate-400" />
                                                    {app.student?.profile?.education || 'No education listed'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {app.student?.profile?.skills?.join(', ') || 'No skills listed'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
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
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                    disabled={app.status === 'accepted'}
                                                    className={`p-2 rounded-lg transition-colors ${app.status === 'accepted' ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
                                                    title="Accept"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    disabled={app.status === 'rejected'}
                                                    className={`p-2 rounded-lg transition-colors ${app.status === 'rejected' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                {app.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handleIssueCertificate(app.student._id)}
                                                        className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50"
                                                        title="Issue Certificate"
                                                    >
                                                        <Award className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantReview;
