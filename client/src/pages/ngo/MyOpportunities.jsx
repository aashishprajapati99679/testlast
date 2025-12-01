import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Search, MapPin, Calendar, Users, Trash2, Eye, Briefcase } from 'lucide-react';

const MyOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const { data } = await axios.get('/api/ngo/opportunities');
                setOpportunities(data.data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            try {
                await axios.delete(`/api/ngo/opportunities/${id}`);
                setOpportunities(opportunities.filter(op => op._id !== id));
            } catch (error) {
                console.error('Error deleting opportunity:', error);
            }
        }
    };

    const [qrModal, setQrModal] = useState(null);

    const handleGenerateQR = (opportunity) => {
        setQrModal(opportunity);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">My Opportunities</h1>
                    <p className="text-slate-500 mt-1 text-lg">Manage your posted events and track applications.</p>
                </div>
                <Link to="/ngo/opportunities/create" className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm hover:shadow-md">
                    <PlusCircle className="w-5 h-5" />
                    Post New
                </Link>
            </div>

            {opportunities.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No opportunities posted</h3>
                    <p className="text-slate-500 mt-1 mb-6">Create your first volunteering opportunity to start recruiting.</p>
                    <Link to="/ngo/opportunities/create" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Post Opportunity
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {opportunities.map(op => (
                        <div key={op._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${op.type === 'volunteering'
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {op.type}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Posted on {new Date(op.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{op.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {op.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {op.startDate ? new Date(op.startDate).toLocaleDateString() : 'TBD'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                <button
                                    onClick={() => handleGenerateQR(op)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-100 hover:border-slate-300 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    QR Code
                                </button>
                                <Link
                                    to={`/ngo/opportunities/${op._id}/applications`}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
                                >
                                    <Users className="w-4 h-4" />
                                    Applicants
                                </Link>
                                <button
                                    onClick={() => handleDelete(op._id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium hover:bg-red-100 hover:border-red-200 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Modal */}
            {qrModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setQrModal(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <Trash2 className="w-5 h-5 rotate-45" />
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">Scan to Log Hours</h3>
                        <p className="text-slate-500 text-sm mb-4">{qrModal.title}</p>

                        <div className="bg-slate-50 p-3 rounded-xl mb-6 flex items-center justify-between gap-3 border border-slate-200">
                            <div className="text-left overflow-hidden">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Opportunity ID</p>
                                <p className="text-sm font-mono font-medium text-slate-700 truncate">{qrModal._id}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(qrModal._id);
                                    alert('ID copied to clipboard!');
                                }}
                                className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-primary-600 transition-colors border border-transparent hover:border-slate-200"
                                title="Copy ID"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block mb-6">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrModal._id}`}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>

                        <p className="text-xs text-slate-400">
                            Students can scan this code or enter the ID manually to log their hours.
                        </p>

                        <button
                            onClick={() => setQrModal(null)}
                            className="mt-6 w-full py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOpportunities;
