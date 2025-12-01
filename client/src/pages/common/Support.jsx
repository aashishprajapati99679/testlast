import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Search, Filter, ChevronRight, Send, User, Clock } from 'lucide-react';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [replyText, setReplyText] = useState('');

    // Create Form State
    const [formData, setFormData] = useState({
        subject: '',
        category: 'General',
        priority: 'Medium',
        description: ''
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await axios.get('/api/support/my-tickets');
            setTickets(data.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/support', formData);
            setShowCreateModal(false);
            setFormData({ subject: '', category: 'General', priority: 'Medium', description: '' });
            fetchTickets();
            alert('Ticket created successfully');
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket');
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const { data } = await axios.post(`/api/support/${selectedTicket._id}/reply`, { message: replyText });
            setSelectedTicket(data.data); // Update with new message
            setReplyText('');
        } catch (error) {
            console.error('Error replying:', error);
            alert('Failed to send reply');
        }
    };

    const openTicket = async (ticketId) => {
        try {
            const { data } = await axios.get(`/api/support/${ticketId}`);
            setSelectedTicket(data.data);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading support tickets...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Ticket List */}
            <div className={`${selectedTicket ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        My Tickets
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <p>No tickets found.</p>
                            <button onClick={() => setShowCreateModal(true)} className="text-primary-600 font-medium mt-2 hover:underline">Create one</button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {tickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    onClick={() => openTicket(ticket._id)}
                                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-l-4 border-primary-600' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-slate-900 truncate pr-2">{ticket.subject}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'Closed' ? 'bg-slate-100 text-slate-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 truncate mb-2">{ticket.description}</p>
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{ticket.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail / Chat */}
            <div className={`${selectedTicket ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden p-1 hover:bg-slate-200 rounded">
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>
                                <div>
                                    <h2 className="font-bold text-slate-800">{selectedTicket.subject}</h2>
                                    <p className="text-xs text-slate-500 flex items-center gap-2">
                                        Ticket #{selectedTicket._id.slice(-6)} •
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                                    {selectedTicket.priority} Priority
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {/* Original Description */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-slate-100 max-w-[80%]">
                                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                            </div>

                            {/* Chat History */}
                            {selectedTicket.messages.map((msg, idx) => {
                                const isMe = msg.sender._id === selectedTicket.user._id; // Assuming current user is the ticket owner
                                // Note: In a real app, compare with currentUser.id from context
                                // For now, let's assume if sender.role is 'admin', it's support, else it's me.
                                const isSupport = msg.sender.role === 'admin';

                                return (
                                    <div key={idx} className={`flex gap-3 ${!isSupport ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSupport ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                            {isSupport ? 'S' : <User className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-3 rounded-xl shadow-sm max-w-[80%] ${!isSupport
                                                ? 'bg-primary-600 text-white rounded-tr-none'
                                                : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                            <p className={`text-[10px] mt-1 ${!isSupport ? 'text-primary-100' : 'text-slate-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleReply} className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    disabled={selectedTicket.status === 'Closed'}
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim() || selectedTicket.status === 'Closed'}
                                    className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a ticket to view details</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Create Support Ticket</h3>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Technical</option>
                                        <option>Payment</option>
                                        <option>Account</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
                                >
                                    Create Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;
