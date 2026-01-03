import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, X, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import clsx from 'clsx';

const TripDetails = ({ trip, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('notes'); 
  const [newTodo, setNewTodo] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpdateNotes = (notes) => onUpdate({ ...trip, notes });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todos = trip.todos || [];
    onUpdate({ ...trip, todos: [...todos, { id: Date.now(), text: newTodo, completed: false }] });
    setNewTodo('');
  };

  const toggleTodo = (todoId) => {
    const todos = trip.todos || [];
    onUpdate({ ...trip, todos: todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t) });
  };

  // AJOUT : Supprimer une tâche
  const removeTodo = (todoId) => {
    const todos = trip.todos || [];
    onUpdate({ ...trip, todos: todos.filter(t => t.id !== todoId) });
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const images = trip.images || [];
    onUpdate({ ...trip, images: [...images, imageUrl] });
    setImageUrl('');
  };

  // AJOUT : Supprimer une image
  const removeImage = (index) => {
    const images = trip.images || [];
    onUpdate({ ...trip, images: images.filter((_, i) => i !== index) });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center bg-warm-cream/30">
          <h3 className="text-2xl font-serif text-love-900">{trip.destination}</h3>
          <button onClick={onClose} className="p-2 hover:bg-warm-cream rounded-full text-gray-400"><X /></button>
        </div>

        <div className="flex border-b">
          {['notes', 'todos', 'images'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx("flex-1 py-4 text-sm font-medium capitalize transition-colors", activeTab === tab ? "text-love-600 border-b-2 border-love-500 bg-love-50" : "text-gray-500 hover:bg-gray-50")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'notes' && (
            <TextArea label="Notes" value={trip.notes || ''} onChange={(e) => handleUpdateNotes(e.target.value)} placeholder="Flights, restaurants, plans..." className="h-64" />
          )}

          {activeTab === 'todos' && (
            <div className="space-y-4">
              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="New task..." className="flex-1" />
                <Button type="submit">Add</Button>
              </form>
              <div className="space-y-2">
                { (trip.todos || []).map(todo => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 bg-warm-cream/20 rounded-xl group">
                    <div onClick={() => toggleTodo(todo.id)} className="flex items-center gap-3 flex-1 cursor-pointer">
                      {todo.completed ? <CheckSquare className="text-love-500" /> : <Square className="text-gray-300" />}
                      <span className={clsx(todo.completed && "line-through text-gray-400")}>{todo.text}</span>
                    </div>
                    <button onClick={() => removeTodo(todo.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-4">
              <form onSubmit={handleAddImage} className="flex gap-2">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL here..." className="flex-1" />
                <Button type="submit">Add Photo</Button>
              </form>
              <div className="grid grid-cols-2 gap-4">
                {(trip.images || []).map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="Trip" className="w-full h-40 object-cover rounded-xl shadow-sm" />
                    <button 
                      onClick={() => removeImage(idx)} 
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Wishlist = () => {
  const [trips, setTrips] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: '', notes: '', todos: [], images: [] });
  const [selectedTripId, setSelectedTripId] = useState(null);

  useEffect(() => {
    const tripsRef = ref(db, 'trips');
    return onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTrips(list);
      } else { setTrips([]); }
    });
  }, []);

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!newTrip.destination.trim()) return;
    push(ref(db, 'trips'), { ...newTrip, createdAt: Date.now() });
    setNewTrip({ destination: '', notes: '', todos: [], images: [] });
    setIsAdding(false);
  };

  const handleUpdateTrip = (updatedTrip) => {
    const { id, ...data } = updatedTrip;
    update(ref(db, `trips/${id}`), data);
  };

  const removeTrip = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this entire trip plan?")) remove(ref(db, `trips/${id}`));
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8 text-center sm:text-left">
        <h2 className="text-4xl font-serif text-love-900">Trip Planner</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus size={20} /> Plan a Trip
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white p-6 rounded-3xl border border-love-100 shadow-sm mb-8">
              <form onSubmit={handleAddTrip} className="space-y-4">
                <Input label="Where to, love?" value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} placeholder="Paris, London, Rome..." />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit">Let's Dream</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {trips.map((trip) => (
            <motion.div 
              key={trip.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedTripId(trip.id)} 
              className="bg-white rounded-3xl p-6 border border-warm-beige relative cursor-pointer hover:shadow-xl hover:border-love-200 transition-all group"
            >
              <button 
                onClick={(e) => removeTrip(trip.id, e)} 
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <MapPin size={24} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xl font-serif text-love-900 truncate">{trip.destination}</h3>
                  <p className="text-sm text-gray-500 truncate">{trip.notes || "No notes yet"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedTrip && (
          <TripDetails 
            trip={selectedTrip} 
            onClose={() => setSelectedTripId(null)} 
            onUpdate={handleUpdateTrip} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
