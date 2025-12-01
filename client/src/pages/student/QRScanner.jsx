import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, QrCode, AlertCircle } from 'lucide-react';
import axios from 'axios';

const QRScanner = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [manualId, setManualId] = useState('');
    const [scanning, setScanning] = useState(true);

    const handleScan = async (result) => {
        if (result && result[0]?.rawValue) {
            setScanning(false);
            const opportunityId = result[0].rawValue?.trim(); // Trim whitespace
            if (opportunityId) {
                validateAndRedirect(opportunityId);
            }
        }
    };

    const validateAndRedirect = async (opportunityId) => {
        try {
            // Validate ID exists
            await axios.get(`/api/student/opportunity/${opportunityId}`);
            navigate('/student/hours', { state: { opportunityId } });
        } catch (err) {
            console.error('Invalid QR Code:', err);
            const message = err.response?.status === 404
                ? 'Opportunity not found. Please check the ID.'
                : 'Invalid QR Code. Please try again or enter ID manually.';
            setError(message);
            setScanning(true);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualId.trim()) {
            validateAndRedirect(manualId.trim());
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Scan QR Code</h1>
                <p className="text-slate-500 mt-1">Scan the event QR code to log your hours.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden relative">
                    {scanning ? (
                        <Scanner
                            onScan={handleScan}
                            onError={(error) => {
                                console.log(error?.message);
                                // Don't show error to user immediately, just log it
                            }}
                            components={{
                                audio: false,
                                finder: true
                            }}
                            styles={{
                                container: { width: '100%', height: '100%' }
                            }}
                            constraints={{
                                facingMode: 'environment'
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            <p>Processing...</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-50 text-slate-500">Or enter manually</span>
                </div>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Opportunity ID"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                    Go
                </button>
            </form>
        </div>
    );
};

export default QRScanner;
