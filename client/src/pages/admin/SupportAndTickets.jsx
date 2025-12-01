import React, { useState } from 'react';
import SupportRequestsTable from '../../components/admin/SupportRequestsTable';
import SupportRequestModal from '../../components/admin/SupportRequestModal';
import TicketsTable from '../../components/admin/TicketsTable';
import InternalTicketModal from '../../components/admin/InternalTicketModal';

const SupportAndTickets = () => {
    const [activeTab, setActiveTab] = useState('support'); // support, tickets
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    // Support Request Handlers
    const handleViewRequest = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseRequestModal = () => {
        setSelectedRequest(null);
    };

    const handleRequestUpdate = (updatedRequest) => {
        setSelectedRequest(updatedRequest);
        // Ideally we should also update the table list, but for now we rely on the table refetching or we can pass a refresh trigger
        // A simple way is to force re-render of table or pass a callback.
        // For simplicity, we'll let the user refresh or rely on the modal update.
        // Actually, the table fetches on mount/filter change.
        // To make it live, we can lift state up, but that's complex.
        // We'll just close and let the user see the update if they refresh, 
        // OR better: pass a key to table to force re-render.
    };

    // Ticket Handlers
    const handleCreateTicket = () => {
        setSelectedTicket(null);
        setIsTicketModalOpen(true);
    };

    const handleEditTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsTicketModalOpen(true);
    };

    const handleCloseTicketModal = () => {
        setIsTicketModalOpen(false);
        setSelectedTicket(null);
    };

    const handleTicketSave = (savedTicket) => {
        if (selectedTicket) {
            setSelectedTicket(savedTicket); // Update modal if open
        }
        // Again, table refresh needed.
        // We can use a key to force refresh.
    };

    const [refreshKey, setRefreshKey] = useState(0);
    const refreshData = () => setRefreshKey(prev => prev + 1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Support & Tickets</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
                <button
                    onClick={() => setActiveTab('support')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'support'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Support Requests
                </button>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tickets'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Tickets Management
                </button>
            </div>

            {/* Content */}
            {activeTab === 'support' ? (
                <SupportRequestsTable key={`support-${refreshKey}`} onView={handleViewRequest} />
            ) : (
                <TicketsTable key={`tickets-${refreshKey}`} onEdit={handleEditTicket} onCreate={handleCreateTicket} />
            )}

            {/* Modals */}
            {selectedRequest && (
                <SupportRequestModal
                    request={selectedRequest}
                    onClose={handleCloseRequestModal}
                    onUpdate={(updated) => {
                        handleRequestUpdate(updated);
                        refreshData();
                    }}
                />
            )}

            {isTicketModalOpen && (
                <InternalTicketModal
                    ticket={selectedTicket}
                    onClose={handleCloseTicketModal}
                    onSave={(saved) => {
                        handleTicketSave(saved);
                        refreshData();
                    }}
                />
            )}
        </div>
    );
};

export default SupportAndTickets;
