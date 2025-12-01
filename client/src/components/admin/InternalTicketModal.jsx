import React, { useState, useEffect } from 'react';
import { X, Save, User, Tag, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { createTicket, updateTicket, addTicketComment } from '../../services/ticketService';
import TicketTimeline from './TicketTimeline';
import api from '../../services/api';

const InternalTicketModal = ({ ticket, onClose, onSave }) => {
    const isEditing = !!ticket;
    const [formData, setFormData] = useState({
        category: 'General Query',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        status: 'Open',
        tags: ''
    });
    const [comment, setComment] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // details, comments, timeline

    useEffect(() => {
        if (ticket) {
            setFormData({
                category: ticket.category,
                description: ticket.description,
                assignedTo: ticket.assignedTo?._id || '',
                priority: ticket.priority,
                status: ticket.status,
                tags: ticket.tags?.join(', ') || ''
            });
        }
        fetchUsers();
    }, [ticket]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            if (data.success) {
                // Filter for admins only if needed, but for now showing all as per "assigned to admin user" requirement
                // Ideally backend should filter, but let's filter here for 'admin' role if possible.
                // Assuming user object has role.
                const admins = data.data.filter(u => u.role === 'admin');
                setUsers(admins.length > 0 ? admins : data.data); // Fallback to all if no admins found (for testing)
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            let result;
            if (isEditing) {
                result = await updateTicket(ticket._id, dataToSubmit);
            } else {
                result = await createTicket(dataToSubmit);
            }

            if (result.success) {
                onSave(result.data);
                if (!isEditing) onClose();
            }
        } catch (error) {
            console.error('Error saving ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const result = await addTicketComment(ticket._id, comment);
            if (result.success) {
                setComment('');
                onSave(result.data); // Update parent with new data (including comments)
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        {isEditing ? 'Edit Ticket' : 'Create New Ticket'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs (only for editing) */}
                {isEditing && (
                    <div className="flex border-b border-slate-100 bg-white">
                        <button
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'details' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'comments' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('comments')}
                        >
                            Comments ({ticket.comments?.length || 0})
                            {activeTab === 'comments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeTab === 'timeline' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('timeline')}
                        >
                            Timeline
                            {activeTab === 'timeline' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {activeTab === 'details' && (
                        <form id="ticket-form" onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none font-medium text-slate-700"
                                        >
                                            <option value="General Query">General Query</option>
                                            <option value="Bug">Bug</option>
                                            <option value="Refund">Refund</option>
                                            <option value="Verification Issue">Verification Issue</option>
                                            <option value="Payment Failure">Payment Failure</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Priority</label>
                                    <div className="relative">
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none font-medium text-slate-700"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-slate-700 resize-none"
                                    placeholder="Describe the issue in detail..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Assigned To</label>
                                    <div className="relative">
                                        <select
                                            name="assignedTo"
                                            value={formData.assignedTo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none font-medium text-slate-700"
                                        >
                                            <option value="">Select Admin</option>
                                            {users.map(user => (
                                                <option key={user._id} value={user._id}>{user.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                {isEditing && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none font-medium text-slate-700"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tags (comma separated)</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-slate-700"
                                        placeholder="urgent, frontend, backend"
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === 'comments' && (
                        <div className="space-y-4">
                            <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {ticket.comments?.map((comment, index) => (
                                    <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-800">{comment.user?.name}</span>
                                            <span className="text-xs text-slate-400 font-medium">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                                    </div>
                                ))}
                                {ticket.comments?.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageSquare className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-medium">No comments yet.</p>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleAddComment} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!comment.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <TicketTimeline timeline={ticket.timeline} />
                    )}
                </div>

                {/* Footer */}
                {activeTab === 'details' && (
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="ticket-form"
                            disabled={loading}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Ticket'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternalTicketModal;
