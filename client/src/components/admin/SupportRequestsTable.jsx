import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { getSupportRequests } from '../../services/supportService';

const SupportRequestsTable = ({ onView }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
        role: 'All',
        search: ''
    });

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getSupportRequests(filters);
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Error fetching support requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(debounce);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-600 border-red-200';
            case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'Low': return 'bg-blue-50 text-blue-600 border-blue-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by subject or message..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        name="role"
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:border-primary-300 transition-colors"
                        value={filters.role}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Roles</option>
                        <option value="Student">Student</option>
                        <option value="NGO">NGO</option>
                    </select>
                    <select
                        name="priority"
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:border-primary-300 transition-colors"
                        value={filters.priority}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select
                        name="status"
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:border-primary-300 transition-colors"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                        <p className="font-medium">Loading requests...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    <p className="font-medium">No support requests found.</p>
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-slate-800">{req.user?.name || 'Unknown'}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mt-1 capitalize">
                                                {req.user?.role || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-700 font-medium truncate max-w-xs">{req.subject}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(req.priority)} shadow-sm`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(req.status)} shadow-sm`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onView(req)}
                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
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

export default SupportRequestsTable;
