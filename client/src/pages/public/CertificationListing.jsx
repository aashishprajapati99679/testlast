import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CertificationListing = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredCertifications = certifications.filter(cert =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const { data } = await axios.get('/api/certifications', { withCredentials: true });
                if (data.success) {
                    setCertifications(data.data);
                }
            } catch (error) {
                console.error('Error fetching certifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Certifications</h1>
                <p className="text-xl text-gray-600">Upgrade your skills with industry-recognized certifications</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12 relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search certifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCertifications.map((cert) => (
                    <div key={cert._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <Award className="w-8 h-8 text-indigo-600" />
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${cert.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                    cert.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {cert.difficulty}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.title}</h3>
                            <p className="text-sm text-indigo-600 font-medium mb-4">{cert.company}</p>
                            <p className="text-gray-600 mb-6 line-clamp-3">{cert.description}</p>
                        </div>

                        <div className="p-6 pt-0 mt-auto">
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">
                                    {cert.price === 0 ? 'Free' : `₹${cert.price}`}
                                </span>
                                <button
                                    onClick={() => navigate(`/student/certifications/${cert._id}`)}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificationListing;
