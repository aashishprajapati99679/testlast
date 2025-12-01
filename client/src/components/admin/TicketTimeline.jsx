import React from 'react';
import { Clock, CheckCircle, Edit, MessageSquare, AlertCircle } from 'lucide-react';

const TicketTimeline = ({ timeline }) => {
    const getIcon = (action) => {
        switch (action) {
            case 'created': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'updated': return <Edit className="w-4 h-4 text-yellow-500" />;
            case 'commented': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
            case 'closed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Activity Timeline
            </h4>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {timeline?.slice().reverse().map((event, index) => (
                    <div key={index} className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-0 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm group-hover:scale-110 transition-transform duration-200">
                            {getIcon(event.action)}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 -mt-2">
                            <p className="text-sm text-slate-800">
                                <span className="font-bold capitalize text-primary-700">{event.action}</span>
                                {event.details && <span className="text-slate-500 font-medium"> • {event.details}</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(event.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
                {timeline?.length === 0 && (
                    <div className="pl-8 text-slate-400 text-sm italic">No activity recorded yet.</div>
                )}
            </div>
        </div>
    );
};

export default TicketTimeline;
