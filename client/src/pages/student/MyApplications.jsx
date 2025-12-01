import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, CheckCircle, XCircle, Clock, Search, Filter, ArrowRight, CreditCard } from 'lucide-react';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await axios.get('/api/internships/applications/mine'); // Updated to fetch internship applications
                setApplications(data.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handlePayment = async (application) => {
        try {
            const { data: orderData } = await axios.post(`/api/internships/applications/${application._id}/pay`, {}, { withCredentials: true });

            if (!orderData.success) {
                alert('Failed to create order');
                return;
            }



            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "GETSERVE.in",
                description: `Internship Confirmation Fee`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        const { data: verifyRes } = await axios.post(`/api/internships/applications/${application._id}/verify`, verifyData, {
                            withCredentials: true
                        });

                        if (verifyRes.success) {
                            alert('Payment successful! Internship confirmed.');
                            // Refresh applications
                            setApplications(prev => prev.map(app =>
                                app._id === application._id ? { ...app, status: 'hired' } : app
                            ));
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: "Student Name",
                    email: "student@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            alert(error.response?.data?.message || 'Failed to initiate payment');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'hired':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hired
                    </span>
                );
            case 'selected_pending_payment':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <CreditCard className="w-3 h-3 mr-1" /> Payment Pending
                    </span>
                );
            case 'accepted': // Keeping for backward compatibility or other types
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Accepted
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </span>
                );
        }
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
                    <h1 className="text-3xl font-heading font-bold text-slate-900">My Internship Applications</h1>
                    <p className="text-slate-500 mt-1 text-lg">Track the status of your internship applications.</p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
                    <p className="text-slate-500 mt-1 mb-6">Start applying to internships to gain experience.</p>
                    <a href="/student/internships" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Browse Internships <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Internship</th>
                                    <th className="px-6 py-4">Organization</th>
                                    <th className="px-6 py-4">Applied On</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{app.internship?.title || 'Unknown Internship'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-500">{app.internship?.organization?.name || 'Unknown Organization'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'selected_pending_payment' && (
                                                <button
                                                    onClick={() => handlePayment(app)}
                                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                >
                                                    Pay & Confirm
                                                </button>
                                            )}
                                            {app.status !== 'selected_pending_payment' && (
                                                <button className="text-sm font-medium text-slate-400 hover:text-primary-600 transition-colors">
                                                    View Details
                                                </button>
                                            )}
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

export default MyApplications;
