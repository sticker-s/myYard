import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Ticket as TicketIcon, Calendar, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

const MyTickets = () => {
  const { api } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
      setLoading(false);
    };
    fetchTickets();
  }, [api]);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">My Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your purchased event tickets.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <TicketIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">No tickets yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't bought any tickets.</p>
          <Link to="/" className="px-6 py-3 bg-retroPrimary hover:bg-retroPrimary/90 dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 text-white dark:text-gray-900 font-bold rounded-lg transition">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tickets.map(ticket => (
            <div key={ticket._id} className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition">
              <div className="w-full sm:w-1/3 h-40 sm:h-auto relative">
                <img src={ticket.event?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={ticket.event?.title || 'Unknown Event'} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-black/20 sm:hidden"></div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between border-l-4 border-dashed border-gray-100 dark:border-gray-700 relative">
                {/* Cutout shapes for ticket effect */}
                <div className="hidden sm:block absolute -left-3 top-[-10px] w-5 h-5 bg-retroBg dark:bg-darkBg rounded-full"></div>
                <div className="hidden sm:block absolute -left-3 bottom-[-10px] w-5 h-5 bg-retroBg dark:bg-darkBg rounded-full"></div>
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{ticket.event?.title || 'Deleted Event'}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      ticket.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      ticket.status === 'used' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {ticket.event ? format(new Date(ticket.event.date), 'MMM d, yyyy h:mm a') : 'N/A'}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> <span className="truncate">{ticket.event?.location || 'N/A'}</span></div>
                  </div>
                  
                  {ticket.status === 'paid' && (
                    <div className="mt-4 mb-2 flex flex-col items-center">
                      <div className="bg-white p-2 rounded-xl inline-block border border-gray-100">
                        <QRCode value={ticket._id} size={90} />
                      </div>
                      <p className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 select-all">
                        {ticket._id}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tier</p>
                    <p className="font-bold text-retroPrimary dark:text-darkPrimary">{ticket.tierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</p>
                    <p className="font-bold">${ticket.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
