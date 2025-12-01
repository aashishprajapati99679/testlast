import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, CheckCircle, Loader2, Search, Filter } from 'lucide-react';

const VolunteeringOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [oppRes, appRes] = await Promise.all([
                axios.get('/api/student/opportunities'),
                axios.get('/api/student/applications')
            ]);

            setOpportunities(oppRes.data.data);

            const ids = new Set(appRes.data.data.map(app => {
                return app.opportunity?._id || app.opportunity;
            }));
            setAppliedIds(ids);

            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleApply = async (id) => {
        setApplying(id);
        setError(null);
        setSuccessMessage('');
        try {
            await axios.post(`/api/student/apply/${id}`);
            setSuccessMessage('Application submitted successfully!');
            setAppliedIds(prev => new Set(prev).add(id));
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;

            if (status === 400 && msg && (msg.includes('already applied') || msg.includes('Already applied'))) {
                setError('You have already applied for this opportunity.');
                setAppliedIds(prev => new Set(prev).add(id));
            } else {
                setError(msg || 'Failed to apply');
            }
        } finally {
            setApplying(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-slate-600 font-medium">Loading opportunities...</span>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Volunteering Opportunities</h1>
                    <p className="text-slate-500 mt-1 text-lg">Find and apply for volunteering events to make a difference.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {opportunities.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No opportunities found</h3>
                    <p className="text-slate-500 mt-1">Check back later for new volunteering events.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => {
                        const isApplied = appliedIds.has(opp._id);
                        return (
                            <div key={opp._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-2">
                                                {opp.type}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{opp.title}</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1">{opp.organization?.name}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {opp.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{opp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{opp.startDate ? format(new Date(opp.startDate), 'MMM d, yyyy') : 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span>{opp.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={() => handleApply(opp._id)}
                                        disabled={applying === opp._id || isApplied}
                                        className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm
                                            ${applying === opp._id || isApplied
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                                : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 active:scale-[0.98]'
                                            }`}
                                    >
                                        {applying === opp._id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Applying...</span>
                                            </>
                                        ) : isApplied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Applied</span>
                                            </>
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VolunteeringOpportunities;
