import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

const Home = () => {
  const { api } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [api]);

  return (
    <div>
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Discover <span className="text-retroPrimary dark:text-darkPrimary">Experiences</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Find and book tickets for the best events, workshops, and gatherings on campus.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xl text-gray-500 dark:text-gray-400">No events found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Link 
              key={event._id} 
              to={`/events/${event._id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                  From ${Math.min(...event.priceTiers.map(t => t.price))}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-retroPrimary dark:group-hover:text-darkPrimary transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-retroAccent dark:text-darkAccent" />
                    {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-retroAccent dark:text-darkAccent" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
