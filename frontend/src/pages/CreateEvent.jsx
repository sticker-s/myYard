import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const CreateEvent = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    capacity: '',
    priceTiers: [{ name: 'Standard', price: 0, quantity: 0 }]
  });

  const handleTierChange = (index, field, value) => {
    const newTiers = [...form.priceTiers];
    newTiers[index][field] = field === 'name' ? value : Number(value);
    setForm({ ...form, priceTiers: newTiers });
  };

  const addTier = () => {
    setForm({
      ...form,
      priceTiers: [...form.priceTiers, { name: '', price: 0, quantity: 0 }]
    });
  };

  const removeTier = (index) => {
    if (form.priceTiers.length > 1) {
      const newTiers = form.priceTiers.filter((_, i) => i !== index);
      setForm({ ...form, priceTiers: newTiers });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totalCapacity = form.priceTiers.reduce((acc, tier) => acc + (Number(tier.quantity) || 0), 0);
      const submitData = {
        ...form,
        capacity: totalCapacity,
      };
      
      await api.post('/events', submitData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-retroPrimary dark:hover:text-darkPrimary mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Create New Event</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Event Title</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-retroPrimary" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
              <textarea required rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-retroPrimary"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date & Time</label>
              <input type="datetime-local" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-retroPrimary" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
              <input type="text" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-retroPrimary" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Total Capacity</label>
              <input type="number" readOnly value={form.priceTiers.reduce((acc, tier) => acc + (Number(tier.quantity) || 0), 0)} className="w-full p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Event Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-retroPrimary/10 file:text-retroPrimary hover:file:bg-retroPrimary/20 dark:file:bg-darkPrimary/10 dark:file:text-darkPrimary dark:hover:file:bg-darkPrimary/20 cursor-pointer" 
              />
              {form.image && (
                <div className="mt-3 relative h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Pricing Tiers</h3>
              <button type="button" onClick={addTier} className="text-sm flex items-center gap-1 text-retroPrimary dark:text-darkPrimary hover:underline font-semibold">
                <Plus className="w-4 h-4" /> Add Tier
              </button>
            </div>
            
            <div className="space-y-4">
              {form.priceTiers.map((tier, index) => (
                <div key={index} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Tier Name</label>
                    <input type="text" required placeholder="e.g. VIP" value={tier.name} onChange={e => handleTierChange(index, 'name', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Price ($)</label>
                    <input type="number" min="0" required value={tier.price} onChange={e => handleTierChange(index, 'price', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Quantity</label>
                    <input type="number" min="1" required value={tier.quantity} onChange={e => handleTierChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 text-sm" />
                  </div>
                  {form.priceTiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition mb-px">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-retroPrimary hover:bg-retroPrimary/90 dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 text-white dark:text-gray-900 font-bold rounded-lg transition mt-8 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
