import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Briefcase } from 'lucide-react';

const AdminCreateInternship = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        startDate: '',
        duration: '',
        stipend: '',
        skillsRequired: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
            };

            await axios.post('/api/internships/create', payload);
            navigate('/admin/internships');
        } catch (error) {
            console.error('Error creating internship:', error);
            alert('Failed to create internship');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Post Internship</h1>
                <p className="text-gray-500 mt-1">Create a new internship opportunity.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Social Media Intern"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the role and responsibilities..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Remote, Mumbai"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g. 3 Months"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (Optional)</label>
                        <input
                            type="text"
                            name="stipend"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.stipend}
                            onChange={handleChange}
                            placeholder="e.g. ₹5000/month"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (Comma separated)</label>
                    <input
                        type="text"
                        name="skillsRequired"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        value={formData.skillsRequired}
                        onChange={handleChange}
                        placeholder="e.g. Communication, Design, React"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Internship'}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateInternship;
