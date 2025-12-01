import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Search, Filter, ChevronRight, Send, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await axios.get('/api/support/admin/all');
            setTickets(data.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const { data } = await axios.post(`/api/support/${selectedTicket._id}/reply`, { message: replyText });
            setSelectedTicket(data.data);
            setReplyText('');
            fetchTickets(); // Refresh list to update status if changed
        } catch (error) {
            console.error('Error replying:', error);
            alert('Failed to send reply');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const { data } = await axios.put(`/api/support/${selectedTicket._id}/status`, { status: newStatus });
            setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            fetchTickets();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredTickets = filterStatus === 'All'
        ? tickets
        : tickets.filter(t => t.status === filterStatus);

    if (loading) return <div className="p-8 text-center">Loading tickets...</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">
            {/* Ticket List */}
            <div className="w-1/3 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                            Support Tickets
                        </h2>
                        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                            {tickets.filter(t => t.status === 'Open').length} Open
                        </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === status
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No tickets found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredTickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?._id === ticket._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate pr-2">{ticket.subject}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'Closed' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mb-2">{ticket.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> {ticket.user?.name || 'Unknown'}
                                        </span>
                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail */}
            <div className="w-2/3 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-gray-800 text-lg">{selectedTicket.subject}</h2>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" /> {selectedTicket.user?.name} ({selectedTicket.user?.role})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedTicket.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                                >
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Resolved</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {/* Original Issue */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 font-bold text-gray-600">
                                    {selectedTicket.user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-900">{selectedTicket.user?.name}</span>
                                            <span className="text-xs text-gray-400">Original Request</span>
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.description}</p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{selectedTicket.category}</span>
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{selectedTicket.priority} Priority</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thread */}
                            {selectedTicket.messages.map((msg, idx) => {
                                const isAdmin = msg.sender.role === 'admin';
                                return (
                                    <div key={idx} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${isAdmin ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {isAdmin ? 'A' : msg.sender.name?.charAt(0)}
                                        </div>
                                        <div className={`flex-1 max-w-[80%] ${isAdmin ? 'flex justify-end' : ''}`}>
                                            <div className={`p-4 rounded-2xl shadow-sm ${isAdmin
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'
                                                }`}>
                                                <div className="flex justify-between items-center mb-1 gap-4">
                                                    <span className={`font-semibold text-sm ${isAdmin ? 'text-indigo-100' : 'text-gray-900'}`}>
                                                        {msg.sender.name}
                                                    </span>
                                                    <span className={`text-xs ${isAdmin ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reply Box */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleReply} className="flex gap-4">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Reply
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a ticket to manage</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupport;
