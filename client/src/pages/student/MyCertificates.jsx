import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, ExternalLink, Award } from 'lucide-react';

const MyCertificates = () => {
    const [myCertifications, setMyCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCertifications = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/certifications/my', {
                    withCredentials: true
                });
                if (data.success) {
                    setMyCertifications(data.data);
                }
            } catch (error) {
                console.error('Error fetching my certifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCertifications();
    }, []);

    const handleDownload = async (id, title) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/certifications/${id}/download`, {
                withCredentials: true,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}-Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Failed to download certificate');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Learning & Certificates</h1>

            <div className="grid grid-cols-1 gap-6">
                {myCertifications.map((item) => {
                    const certData = item.certification || item.opportunity;
                    const title = certData?.title || 'Untitled Certificate';
                    const organization = item.certification ? certData.company : certData?.organization?.name;
                    const isVolunteering = !!item.opportunity;

                    return (
                        <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-indigo-50 rounded-xl mr-6">
                                    <Award className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                                    <p className="text-gray-500">{organization}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Started: {new Date(item.appliedAt).toLocaleDateString()}
                                        </span>
                                        {isVolunteering && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                Volunteering
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {!isVolunteering && (
                                    <a
                                        href={certData.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Go to Course
                                    </a>
                                )}

                                <button
                                    onClick={() => handleDownload(item.certification?._id || item.opportunity?._id, title)}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Certificate
                                </button>
                            </div>
                        </div>
                    );
                })}

                {myCertifications.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No certifications yet</h3>
                        <p className="text-gray-500">Start learning to earn certificates!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCertificates;
