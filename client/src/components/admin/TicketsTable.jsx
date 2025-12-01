import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { getTickets, deleteTicket } from '../../services/ticketService';

const TicketsTable = ({ onEdit, onCreate }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await getTickets();
            if (data.success) {
                setTickets(data.data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await deleteTicket(id);
                setTickets(tickets.filter(t => t._id !== id));
            } catch (error) {
                console.error('Error deleting ticket:', error);
            }
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Internal Tickets</h3>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Create Ticket
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Assigned To</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                        <p className="font-medium">Loading tickets...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : tickets.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    <p className="font-medium">No tickets found. Create one to get started.</p>
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800">{ticket.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 truncate max-w-xs font-medium">{ticket.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 border border-primary-200">
                                                {ticket.assignedTo?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{ticket.assignedTo?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(ticket.priority)} shadow-sm`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)} shadow-sm`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(ticket.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(ticket)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                                                title="Edit Ticket"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ticket._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                                                title="Delete Ticket"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
    );
};

export default TicketsTable;
