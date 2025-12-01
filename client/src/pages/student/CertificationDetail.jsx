import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, ExternalLink, FileText, Lock, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const CertificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        const fetchCertification = async () => {
            try {
                const { data } = await axios.get(`/api/certifications/${id}`, { withCredentials: true });
                if (data.success) {
                    setCertification(data.data);
                    setIsPurchased(data.isPurchased);
                }
            } catch (error) {
                console.error('Error fetching certification:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertification();
    }, [id]);

    const handlePayment = async () => {
        try {
            const { data: orderData } = await axios.post(`/api/certifications/${id}/pay`, {}, { withCredentials: true });

            if (!orderData.success) {
                alert('Failed to create order');
                return;
            }



            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "GETSERVE.in",
                description: `Payment for ${certification.title}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        const { data: verifyRes } = await axios.post(`/api/certifications/${id}/verify`, verifyData, {
                            withCredentials: true
                        });

                        if (verifyRes.success) {
                            alert('Payment successful! You are now enrolled.');
                            setIsPurchased(true);
                            // Reload to get full data (links/resources)
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
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

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!certification) return <div className="text-center py-20">Certification not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate('/student/certifications')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Certifications
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${certification.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                certification.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {certification.difficulty}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{certification.title}</h1>
                            <p className="text-lg text-indigo-600 font-medium">{certification.company}</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-xl">
                            <Award className="w-12 h-12 text-indigo-600" />
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-600 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About this Certification</h3>
                        <p>{certification.description}</p>
                    </div>

                    {isPurchased ? (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">You are enrolled!</h3>
                            </div>

                            <div className="space-y-4">
                                {certification.link && (
                                    <div>
                                        <h4 className="text-sm font-medium text-green-800 mb-2">Official Certification Link</h4>
                                        <a
                                            href={certification.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Go to Course <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                )}

                                {certification.resources && (
                                    <div>
                                        <h4 className="text-sm font-medium text-green-800 mb-2">Resources</h4>
                                        <div className="bg-white p-4 rounded-lg border border-green-100 text-gray-700 whitespace-pre-wrap">
                                            {certification.resources}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Unlock Full Access</h3>
                                    <p className="text-gray-600">Get access to course links, resources, and certification details.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {certification.price === 0 ? 'Free' : `₹${certification.price}`}
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                                    >
                                        {certification.price === 0 ? 'Enroll for Free' : 'Pay & Unlock'}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <Lock className="w-4 h-4" />
                                <span>Secure payment via Razorpay</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificationDetail;
