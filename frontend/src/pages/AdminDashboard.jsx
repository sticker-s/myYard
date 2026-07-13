import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Tag, Calendar, Users, Activity, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // events | tickets

  useEffect(() => {
    fetchData();
  }, [api]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, ticketsRes] = await Promise.all([
        api.get('/events'),
        api.get('/tickets/admin')
      ]);
      setEvents(eventsRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting event', error);
      }
    }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      await api.put(`/tickets/${id}/status`, { status });
      fetchData(); // refresh data to show updated status
    } catch (error) {
      console.error('Error updating ticket status', error);
    }
  };

  if (loading) return <div className="py-10 text-center">Loading dashboard...</div>;

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage events and track ticket sales.</p>
        </div>
        <Link 
          to="/admin/create-event" 
          className="flex items-center gap-2 bg-retroPrimary hover:bg-retroPrimary/90 dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
        >
          <Plus className="w-5 h-5" /> Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'events' ? 'text-retroPrimary dark:text-darkPrimary' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
        >
          Manage Events
          {activeTab === 'events' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-retroPrimary dark:bg-darkPrimary"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'tickets' ? 'text-retroPrimary dark:text-darkPrimary' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
        >
          Ticket Sales
          {activeTab === 'tickets' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-retroPrimary dark:bg-darkPrimary"></div>}
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event Details</th>
                  <th className="px-6 py-4 font-semibold">Date & Location</th>
                  <th className="px-6 py-4 font-semibold">Capacity</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.map(event => {
                  const totalSold = event.priceTiers.reduce((sum, tier) => sum + tier.sold, 0);
                  const progress = Math.min(100, Math.round((totalSold / event.capacity) * 100));
                  
                  return (
                    <tr key={event._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={event.image || 'https://via.placeholder.com/40'} alt={event.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{event.priceTiers.length} Pricing Tiers</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate w-32">{event.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{totalSold} Sold</span>
                          <span className="text-gray-500">{event.capacity} Total</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-retroPrimary dark:bg-darkPrimary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDeleteEvent(event._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition" title="Delete Event">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold">Tier & Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map(ticket => (
                  <tr key={ticket._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{ticket.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{ticket.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{ticket.event?.title || 'Unknown Event'}</div>
                      <div className="text-xs text-gray-500">ID: {ticket._id.toString().substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-semibold">
                        <Tag className="w-3 h-3" /> {ticket.tierName}
                      </div>
                      <div className="mt-1 font-medium text-retroPrimary dark:text-darkPrimary">${ticket.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-md px-2 py-1 border-none focus:ring-0 cursor-pointer ${
                          ticket.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          ticket.status === 'used' ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        <option value="paid">Paid</option>
                        <option value="used">Used</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Placeholder for more actions if needed */}
                      <span className="text-xs text-gray-400">-</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
