import React from 'react';
import { FileText, Filter, Search } from 'lucide-react';
import axios from 'axios';

const AdminApplications = () => {
    const [applications, setApplications] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filter, setFilter] = React.useState('All');

    React.useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await axios.get('/api/admin/applications', { withCredentials: true });
                setApplications(data.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.opportunity.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || app.type === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none"
                >
                    <option value="All">All Types</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Opportunity</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredApplications.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No applications found.
                                </td>
                            </tr>
                        ) : (
                            filteredApplications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div>{app.applicant}</div>
                                        <div className="text-xs text-gray-500">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded text-xs ${app.type === 'Internship' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {app.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{app.opportunity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(app.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'approved' || app.status === 'hired' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        View Details
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplications;
