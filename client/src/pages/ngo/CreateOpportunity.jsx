import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Type, MapPin, Calendar, Clock, Briefcase, DollarSign, List, Save, Loader2, ArrowLeft } from 'lucide-react';

const CreateOpportunity = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'volunteering',
        description: '',
        location: '',
        duration: '',
        skillsRequired: '',
        stipend: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s);

            if (formData.type === 'internship') {
                const payload = {
                    title: formData.title,
                    description: formData.description,
                    location: formData.location,
                    startDate: formData.startDate,
                    duration: formData.duration,
                    stipend: formData.stipend,
                    skillsRequired: skillsArray
                };
                await axios.post('/api/internships/create', payload);
                navigate('/ngo/internships');
            } else {
                const payload = { ...formData, skillsRequired: skillsArray };
                await axios.post('/api/ngo/opportunities', payload);
                navigate('/ngo/opportunities');
            }
        } catch (error) {
            console.error('Error creating opportunity:', error);
            alert('Failed to create opportunity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">Post New Opportunity</h1>
                <p className="text-slate-500 mt-1 text-lg">Create a new volunteering event or internship to recruit students.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Type className="w-4 h-4 text-slate-400" />
                                Opportunity Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder={formData.type === 'internship' ? "e.g. Social Media Intern" : "e.g. Community Beach Cleanup"}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white appearance-none"
                                >
                                    <option value="volunteering">Volunteering</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="City, Remote, etc."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <List className="w-4 h-4 text-slate-400" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                required
                                placeholder="Describe the role, responsibilities, and impact..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Details & Requirements</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. 3 Months, 1 Day"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <List className="w-4 h-4 text-slate-400" />
                                    Skills Required
                                </label>
                                <input
                                    type="text"
                                    name="skillsRequired"
                                    value={formData.skillsRequired}
                                    onChange={handleChange}
                                    placeholder="e.g. Teaching, Design (comma separated)"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        {formData.type === 'internship' && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    Stipend
                                </label>
                                <input
                                    type="text"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleChange}
                                    placeholder="e.g. ₹5000/month"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            {formData.type === 'volunteering' && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Publish Opportunity
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOpportunity;
