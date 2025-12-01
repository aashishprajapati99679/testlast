import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';

const HourPackageCard = ({ onPackageUpdate }) => {
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    const fetchPackageStatus = async () => {
        try {
            const { data } = await axios.get('/api/packages/my-status', { withCredentials: true });
            setPackageData(data.data);
            if (onPackageUpdate) onPackageUpdate(data.data);
        } catch (error) {
            console.error('Error fetching package status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackageStatus();
    }, []);

    const handlePurchase = async () => {
        setPurchasing(true);
        try {
            const { data: orderData } = await axios.post('/api/packages/purchase', {}, { withCredentials: true });



            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "GETSERVE.in",
                description: "60 Hours Volunteering Package",
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            hours: orderData.packageDetails.hours,
                            amount: orderData.packageDetails.amount
                        };

                        const { data: verifyRes } = await axios.post('/api/packages/verify', verifyData, {
                            withCredentials: true
                        });

                        if (verifyRes.success) {
                            alert('Package purchased successfully!');
                            fetchPackageStatus(); // Refresh data
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Failed to initiate purchase');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-xl"></div>;

    const percentUsed = packageData ? Math.min(100, (packageData.hoursUsed / packageData.totalHours) * 100) : 0;
    const remaining = packageData ? Math.max(0, packageData.totalHours - packageData.hoursUsed) : 0;

    return (
        <div className="card p-5 flex flex-col gap-5">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                            <Clock className="w-5 h-5 text-primary-600" />
                            Hour Package
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Track your volunteering hours balance</p>
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${packageData?.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {packageData?.status === 'active' ? 'Active' : 'Exhausted'}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-600">Used: <span className="font-bold text-slate-900">{packageData?.hoursUsed || 0}h</span></span>
                        <span className="text-slate-600">Total: <span className="font-bold text-slate-900">{packageData?.totalHours || 0}h</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 shadow-sm ${percentUsed > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
                        {remaining} hours remaining
                    </p>
                </div>

                {packageData?.status !== 'active' || remaining < 5 ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                        <div className="flex gap-2.5">
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-amber-800">Low Balance</h4>
                                <p className="text-[10px] text-amber-700 mt-0.5 font-medium leading-relaxed">
                                    {packageData?.totalHours === 0
                                        ? "Purchase hours to start logging."
                                        : "Low hours. Recharge to continue."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none text-sm"
            >
                {purchasing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-4 h-4" />
                        Buy 60 Hours (₹1000)
                    </>
                )}
            </button>
        </div>
    );
};

export default HourPackageCard;
