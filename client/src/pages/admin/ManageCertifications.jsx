import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Check, XCircle } from 'lucide-react';

const ManageCertifications = () => {
    const [certifications, setCertifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        skill_category: '',
        company: '',
        description: '',
        difficulty: 'Beginner',
        link: '',
        resources: '',
        price: 0,
        isActive: true
    });

    const fetchCertifications = async () => {
        try {
            const { data } = await axios.get('/api/certifications', { withCredentials: true });
            if (data.success) {
                setCertifications(data.data);
            }
        } catch (error) {
            console.error('Error fetching certifications:', error);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/certifications/${editingId}`, formData, {
                    withCredentials: true
                });
            } else {
                await axios.post('/api/certifications', formData, {
                    withCredentials: true
                });
            }
            setShowModal(false);
            setEditingId(null);
            resetForm();
            fetchCertifications();
        } catch (error) {
            console.error('Error saving certification:', error);
            alert('Failed to save certification');
        }
    };

    const handleEdit = (cert) => {
        setFormData({
            title: cert.title,
            skill_category: cert.skill_category,
            company: cert.company,
            description: cert.description,
            difficulty: cert.difficulty,
            link: cert.link,
            resources: cert.resources || '',
            price: cert.price,
            isActive: cert.isActive
        });
        setEditingId(cert._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this certification?')) {
            try {
                await axios.delete(`/api/certifications/${id}`, {
                    withCredentials: true
                });
                fetchCertifications();
            } catch (error) {
                console.error('Error deleting certification:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            skill_category: '',
            company: '',
            description: '',
            difficulty: 'Beginner',
            link: '',
            resources: '',
            price: 0,
            isActive: true
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Certifications</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setEditingId(null);
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Certification
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Title</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Company</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Difficulty</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {certifications.map((cert) => (
                            <tr key={cert._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{cert.title}</td>
                                <td className="px-6 py-4 text-gray-600">{cert.skill_category}</td>
                                <td className="px-6 py-4 text-gray-600">{cert.company}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${cert.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        cert.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {cert.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">₹{cert.price}</td>
                                <td className="px-6 py-4">
                                    {cert.isActive ? (
                                        <span className="flex items-center text-green-600 text-sm">
                                            <Check className="w-4 h-4 mr-1" /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-gray-400 text-sm">
                                            <XCircle className="w-4 h-4 mr-1" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cert)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cert._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Certification' : 'Add New Certification'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Category</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Web Development"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.skill_category}
                                        onChange={(e) => setFormData({ ...formData, skill_category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company/Provider</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Link</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resources (Links/Text)</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={formData.resources}
                                    onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                                    placeholder="Add links to study materials, drive folders, etc."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                {editingId ? 'Update Certification' : 'Create Certification'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCertifications;
