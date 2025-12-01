import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';

const VerifyNGOs = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPendingNGOs();
    }, []);

    const fetchPendingNGOs = async () => {
        try {
            const { data } = await axios.get('/api/admin/ngos/pending');
            setNgos(data.data);
        } catch (error) {
            console.error('Error fetching NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this NGO?')) return;
        setActionLoading(id);
        try {
            await axios.put(`/api/admin/ngos/${id}/approve`);
            setNgos(ngos.filter(ngo => ngo._id !== id));
        } catch (error) {
            console.error('Error approving NGO:', error);
            alert('Failed to approve NGO');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this NGO?')) return;
        setActionLoading(id);
        try {
            await axios.put(`/api/admin/ngos/${id}/reject`);
            setNgos(ngos.filter(ngo => ngo._id !== id));
        } catch (error) {
            console.error('Error rejecting NGO:', error);
            alert('Failed to reject NGO');
        } finally {
            setActionLoading(null);
        }
    };

    const handleViewDocument = async (id) => {
        try {
            const response = await axios.get(`/api/admin/ngos/${id}/document`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error viewing document:', error);
            alert('Failed to load document');
        }
    };

    if (loading) return (
        <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Verify NGOs</h1>
                <p className="text-gray-500 mt-1">Review and approve pending NGO registrations.</p>
            </div>

            {ngos.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500">No pending NGO verifications at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {ngos.map(ngo => (
                        <div key={ngo._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{ngo.name}</h3>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        <p><span className="font-medium">Email:</span> {ngo.email}</p>
                                        <p><span className="font-medium">Registered:</span> {new Date(ngo.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    {ngo.verificationDocument && (
                                        <button
                                            onClick={() => handleViewDocument(ngo._id)}
                                            className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Registration Certificate
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => handleApprove(ngo._id)}
                                        disabled={actionLoading === ngo._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === ngo._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(ngo._id)}
                                        disabled={actionLoading === ngo._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === ngo._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerifyNGOs;
