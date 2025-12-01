import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, CheckCircle, XCircle, MoreVertical, Building2 } from 'lucide-react';

const ManageNGOs = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, verified, pending
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNgos = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/admin/users?role=ngo&status=${filter === 'all' ? '' : filter}`, {
                withCredentials: true
            });
            if (data.success) {
                setNgos(data.data);
            }
        } catch (error) {
            console.error('Error fetching NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNgos();
    }, [filter]);

    const handleStatusUpdate = async (id, isVerified) => {
        if (!window.confirm(`Are you sure you want to ${isVerified ? 'approve' : 'reject'} this NGO?`)) return;

        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/status`,
                { isVerified },
                { withCredentials: true }
            );
            fetchNgos(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredNgos = ngos.filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Manage NGOs</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'verified' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Pending
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search NGOs by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredNgos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No NGOs found</td>
                                </tr>
                            ) : (
                                filteredNgos.map((ngo) => (
                                    <tr key={ngo._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{ngo.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {ngo._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ngo.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(ngo.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ngo.isVerified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {ngo.isVerified ? 'Active' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {!ngo.isVerified && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(ngo._id, true)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {ngo.isVerified && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(ngo._id, false)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject/Deactivate"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageNGOs;
