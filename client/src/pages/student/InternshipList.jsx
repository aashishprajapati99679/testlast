import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, CheckCircle, Loader2, Search, Filter, DollarSign, Briefcase } from 'lucide-react';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInternships = internships.filter(internship => {
        const term = searchTerm.toLowerCase();
        return (
            internship.title?.toLowerCase().includes(term) ||
            internship.organization?.name?.toLowerCase().includes(term) ||
            internship.location?.toLowerCase().includes(term)
        );
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [internshipRes, appRes] = await Promise.all([
                axios.get('/api/internships/all'),
                axios.get('/api/internships/applications/mine')
            ]);

            setInternships(internshipRes.data.data);

            const ids = new Set(appRes.data.data.map(app => {
                return app.internship?._id || app.internship;
            }));
            setAppliedIds(ids);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch internships');
            setLoading(false);
        }
    };

    const handleApply = async (id) => {
        setApplying(id);
        setError(null);
        setSuccessMessage('');
        try {
            await axios.post(`/api/internships/apply/${id}`);
            setSuccessMessage('Application submitted successfully!');
            setAppliedIds(prev => new Set(prev).add(id));
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;

            if (status === 400 && msg && (msg.includes('already applied') || msg.includes('Already applied'))) {
                setError('You have already applied for this internship.');
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Internship Opportunities</h1>
                    <p className="text-slate-500 mt-1 text-lg">Explore and apply for internships to gain professional experience.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search internships..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none w-64"
                        />
                    </div>
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

            {filteredInternships.length === 0 ? (
                <div className="bg-white py-16 px-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No internships found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {searchTerm ? `No results found for "${searchTerm}". Try different keywords.` : "There are no open internship opportunities at the moment. Please check back later."}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInternships.map((internship) => {
                        const isApplied = appliedIds.has(internship._id);
                        return (
                            <div key={internship._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 mb-2">
                                                Internship
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{internship.title}</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1">{internship.organization?.name}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {internship.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{internship.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{internship.startDate ? format(new Date(internship.startDate), 'MMM d, yyyy') : 'Immediate'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span>{internship.duration}</span>
                                        </div>
                                        {internship.stipend && (
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <DollarSign className="w-4 h-4 text-slate-400" />
                                                <span>{internship.stipend}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={() => handleApply(internship._id)}
                                        disabled={applying === internship._id || isApplied}
                                        className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm
                                            ${applying === internship._id || isApplied
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                                : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 active:scale-[0.98]'
                                            }`}
                                    >
                                        {applying === internship._id ? (
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

export default InternshipList;
