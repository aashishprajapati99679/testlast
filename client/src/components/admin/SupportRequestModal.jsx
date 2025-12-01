import React, { useState } from 'react';
import { X, Send, User, Shield } from 'lucide-react';
import { replyToSupportRequest, updateSupportStatus } from '../../services/supportService';

const SupportRequestModal = ({ request, onClose, onUpdate }) => {
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(request.status);
    const [priority, setPriority] = useState(request.priority);

    if (!request) return null;

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setSending(true);
        try {
            const data = await replyToSupportRequest(request._id, replyMessage);
            if (data.success) {
                setReplyMessage('');
                onUpdate(data.data); // Update parent with new data
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const data = await updateSupportStatus(request._id, { status: newStatus });
            if (data.success) {
                setStatus(newStatus);
                onUpdate(data.data);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePriorityChange = async (newPriority) => {
        try {
            const data = await updateSupportStatus(request._id, { priority: newPriority });
            if (data.success) {
                setPriority(newPriority);
                onUpdate(data.data);
            }
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{request.subject}</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
                            <span className="text-slate-700">{request.user?.name}</span>
                            <span className="text-slate-300">•</span>
                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs">{request.user?.role}</span>
                            <span className="text-slate-300">•</span>
                            <span>{new Date(request.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
                    {/* Controls */}
                    <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none text-slate-700"
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => handlePriorityChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none text-slate-700"
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

                    {/* Thread */}
                    <div className="space-y-6">
                        {/* Original Message */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                                <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{request.message}</p>
                                <p className="text-xs text-slate-400 mt-3 font-medium">{new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Replies */}
                        {request.thread?.map((msg, index) => (
                            <div key={index} className={`flex gap-4 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ${msg.sender === 'admin' ? 'bg-primary-100' : 'bg-slate-200'}`}>
                                    {msg.sender === 'admin' ? <Shield className="w-5 h-5 text-primary-600" /> : <User className="w-5 h-5 text-slate-500" />}
                                </div>
                                <div className={`p-5 rounded-2xl shadow-sm max-w-[85%] ${msg.sender === 'admin' ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-500/20' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                    <p className={`text-xs mt-3 font-medium ${msg.sender === 'admin' ? 'text-primary-200' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply Input */}
                <div className="p-5 border-t border-slate-100 bg-white">
                    <form onSubmit={handleReply} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Type a reply..."
                            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={sending || !replyMessage.trim()}
                            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SupportRequestModal;
