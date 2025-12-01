import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, DollarSign, Building, ArrowLeft, CheckCircle } from 'lucide-react';

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const { data } = await axios.get(`/api/internships/${id}`);
                setInternship(data.data);
            } catch (error) {
                console.error('Error fetching internship:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInternship();
    }, [id]);

    const handleApply = async () => {
        if (!window.confirm('Are you sure you want to apply for this internship?')) return;

        setApplying(true);
        try {
            await axios.post(`/api/internships/apply/${id}`);
            alert('Application submitted successfully!');
            navigate('/student/applications');
        } catch (error) {
            console.error('Error applying:', error);
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!internship) return <div>Internship not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                    Internship
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${internship.status === 'open' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {internship.status === 'open' ? 'Accepting Applications' : 'Closed'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">{internship.title}</h1>
                            <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                                <Building className="w-5 h-5" />
                                {internship.organization?.name}
                            </div>
                        </div>

                        {internship.status === 'open' && (
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">About the Role</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">
                                {internship.skillsRequired?.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Location</p>
                                    <p className="text-slate-900 font-semibold">{internship.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Duration</p>
                                    <p className="text-slate-900 font-semibold">{internship.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Start Date</p>
                                    <p className="text-slate-900 font-semibold">
                                        {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : 'Immediate'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Stipend</p>
                                    <p className="text-slate-900 font-semibold">{internship.stipend || 'Unpaid'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetail;
