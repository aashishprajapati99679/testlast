import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, MapPin, Calendar, Users, Trash2, Briefcase } from 'lucide-react';

const MyInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const { data } = await axios.get('/api/internships/my-listings');
                setInternships(data.data);
            } catch (error) {
                console.error('Error fetching internships:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship?')) {
            try {
                await axios.delete(`/api/internships/${id}`);
                setInternships(internships.filter(i => i._id !== id));
            } catch (error) {
                console.error('Error deleting internship:', error);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">My Posted Internships</h2>
                <Link to="/ngo/opportunities/create" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    Post Internship
                </Link>
            </div>

            {internships.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">You haven't posted any internships yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {internships.map(internship => (
                        <div key={internship._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{internship.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {internship.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : 'Immediate'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/ngo/internships/${internship._id}/applications`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        <Users className="w-4 h-4" />
                                        Applicants
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(internship._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyInternships;
