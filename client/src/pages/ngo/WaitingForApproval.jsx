import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Clock, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';

const WaitingForApproval = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (user?.verificationStatus === 'approved') {
            navigate('/ngo/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Pending</h1>
                <p className="text-slate-500 mb-8">
                    Thanks for registering! Your account is currently under review by our admin team.
                    We will verify your documents and approve your account shortly.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary-600" />
                        What happens next?
                    </h3>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                        <li>Admin reviews your registration details</li>
                        <li>Your document is verified</li>
                        <li>You receive an email upon approval</li>
                        <li>Access to dashboard is granted</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Check Status
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitingForApproval;
