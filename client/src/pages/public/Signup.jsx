import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { User, Mail, Lock, Building2, GraduationCap, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, verifyOTP, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formData.role === 'ngo' && formData.verificationDocument) {
                const data = new FormData();
                data.append('name', formData.name);
                data.append('email', formData.email);
                data.append('password', formData.password);
                data.append('role', formData.role);
                data.append('verificationDocument', formData.verificationDocument);
                await register(data);
            } else {
                await register(formData);
            }
            setStep(2);
        } catch (err) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await verifyOTP(formData.email, otp);
            if (data.user.role === 'ngo') {
                navigate('/ngo/dashboard');
            } else if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-3xl"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl"></div>
            </div>

            <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-10 relative">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-600/30">
                            G
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-slate-900">
                            {step === 1 ? 'Create Account' : 'Verify Email'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {step === 1 ? 'Join GETSERVE to start making a difference' : `Enter the OTP sent to ${formData.email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        autoComplete="new-password"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700 ml-1">I am a:</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelect('student')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.role === 'student'
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <GraduationCap className={`w-8 h-8 ${formData.role === 'student' ? 'text-primary-600' : 'text-slate-400'}`} />
                                        <span className="font-bold text-sm">Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelect('ngo')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.role === 'ngo'
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Building2 className={`w-8 h-8 ${formData.role === 'ngo' ? 'text-primary-600' : 'text-slate-400'}`} />
                                        <span className="font-bold text-sm">NGO</span>
                                    </button>
                                </div>
                            </div>

                            {formData.role === 'ngo' && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Registration Certificate (PDF)</label>
                                    <input
                                        type="file"
                                        name="verificationDocument"
                                        accept="application/pdf"
                                        onChange={(e) => setFormData({ ...formData, verificationDocument: e.target.files[0] })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                                    />
                                    <p className="text-xs text-slate-500 ml-1">Upload your NGO registration certificate for verification.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Sign Up <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">One-Time Password</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900 text-center text-2xl tracking-widest font-mono"
                                    placeholder="123456"
                                    maxLength={6}
                                />
                                <p className="text-xs text-slate-500 text-center mt-2">
                                    Check your email for the 6-digit code.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Email <CheckCircle className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                            >
                                Change Email
                            </button>
                        </form>
                    )}
                </div>

                {step === 1 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
