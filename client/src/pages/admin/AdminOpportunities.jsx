import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Copy, CheckCircle, XCircle } from 'lucide-react';

const AdminOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/opportunities', {
                    withCredentials: true
                });
                if (data.success) {
                    setOpportunities(data.data);
                }
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    const filteredOpportunities = opportunities.filter(op =>
        op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.organization?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Opportunities</h1>
                    <p className="text-gray-500 mt-1">View and manage all volunteering opportunities.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, Title or Org..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Opportunity Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOpportunities.map((op) => (
                                <tr key={op._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{op.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{op.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{op.organization?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{op.organization?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${op.type === 'volunteering'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {op.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${op.status === 'open'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {op.status === 'open' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {op.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {op._id}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(op._id)}
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="Copy ID"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOpportunities.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No opportunities found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOpportunities;
