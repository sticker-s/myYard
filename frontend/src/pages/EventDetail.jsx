import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Ticket, ArrowLeft } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event', error);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, api]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedTier) {
      setMessage('Please select a ticket tier');
      return;
    }

    setPurchasing(true);
    setMessage('');
    try {
      await api.post('/tickets', { eventId: id, tierName: selectedTier, quantity });
      setPurchaseSuccess(true);
      setTimeout(() => navigate('/my-tickets'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to purchase ticket');
    }
    setPurchasing(false);
  };

  if (loading) return <div className="text-center py-10">Loading event...</div>;
  if (!event) return <div className="text-center py-10">Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-retroPrimary dark:hover:text-darkPrimary mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="h-64 sm:h-80 w-full relative">
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-200 text-sm font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-retroPrimary dark:text-darkPrimary"/> {format(new Date(event.date), 'MMMM d, yyyy h:mm a')}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-retroPrimary dark:text-darkPrimary"/> {event.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                <p className="font-semibold">{event.createdBy.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600 h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-retroPrimary dark:text-darkPrimary" /> Select Tickets
            </h3>
            
            <div className="space-y-3 mb-6">
              {event.priceTiers.map((tier) => {
                const available = tier.quantity - tier.sold;
                const isSoldOut = available <= 0;
                return (
                  <label 
                    key={tier._id} 
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
                      isSoldOut ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
                      selectedTier === tier.name 
                        ? 'border-retroPrimary dark:border-darkPrimary bg-retroPrimary/5 dark:bg-darkPrimary/10' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-retroPrimary/50 dark:hover:border-darkPrimary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="tier" 
                        value={tier.name}
                        disabled={isSoldOut}
                        checked={selectedTier === tier.name}
                        onChange={(e) => {
                          setSelectedTier(e.target.value);
                          setQuantity(1); // Reset quantity when changing tier
                        }}
                        className="text-retroPrimary dark:text-darkPrimary focus:ring-retroPrimary dark:focus:ring-darkPrimary"
                      />
                      <div>
                        <span className="block font-semibold">{tier.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{available} remaining</span>
                      </div>
                    </div>
                    <span className="font-bold text-lg">${tier.price}</span>
                  </label>
                );
              })}
            </div>

            {selectedTier && (
              <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Quantity</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >-</button>
                  <span className="font-bold w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => {
                      const tier = event.priceTiers.find(t => t.name === selectedTier);
                      const maxAvailable = tier ? (tier.quantity - tier.sold) : 1;
                      setQuantity(Math.min(maxAvailable, quantity + 1));
                    }}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >+</button>
                </div>
              </div>
            )}

            {message && <div className="mb-4 text-sm font-medium text-center bg-gray-200 dark:bg-gray-600 p-2 rounded text-red-600 dark:text-red-400">{message}</div>}

            <button 
              onClick={handlePurchase}
              disabled={purchasing || !selectedTier || purchaseSuccess}
              className={`w-full py-3 font-bold rounded-lg transition shadow-md flex justify-center items-center gap-2 ${
                purchaseSuccess 
                  ? 'bg-green-500 text-white cursor-default' 
                  : 'bg-retroPrimary hover:bg-retroPrimary/90 dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {purchaseSuccess ? (
                <>
                  <svg className="w-6 h-6 animate-[bounce_0.5s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  Success!
                </>
              ) : purchasing ? (
                'Processing...'
              ) : (
                `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''}`
              )}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">Mock payment flow - no real charge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
