import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase'; 
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, X, Image as ImageIcon, CheckSquare, Square, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import clsx from 'clsx';

const TripDetails = ({ trip, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('notes'); 
  const [newTodo, setNewTodo] = useState('');

  const handleUpdateNotes = (notes) => {
    onUpdate({ ...trip, notes });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todos = trip.todos || [];
    onUpdate({ 
      ...trip, 
      todos: [...todos, { id: Date.now(), text: newTodo, completed: false }] 
    });
    setNewTodo('');
  };

  const toggleTodo = (todoId) => {
    const todos = trip.todos || [];
    onUpdate({
      ...trip,
      todos: todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
    });
  };

  const removeTodo = (todoId) => {
    const todos = trip.todos || [];
    onUpdate({
      ...trip,
      todos: todos.filter(t => t.id !== todoId)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-warm-beige flex justify-between items-center bg-warm-cream/30">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-500"><MapPin size={20} /></div>
            <div>
              <h3 className="text-2xl font-serif text-love-900">{trip.destination}</h3>
              <p className="text-sm text-gray-500">Shared Trip Plan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-warm-cream rounded-full transition-colors text-gray-400"><X /></button>
        </div>

        <div className="flex border-b border-warm-beige bg-warm-cream/10">
          {['notes', 'todos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-1 py-4 text-sm font-medium transition-all capitalize",
                activeTab === tab ? "text-love-600 border-b-2 border-love-500 bg-love-50/50" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <TextArea 
                label="Our Memories & Plans"
                value={trip.notes || ''}
                onChange={(e) => handleUpdateNotes(e.target.value)}
                placeholder="Flights, hotels, places to visit, restaurants..."
                className="h-64"
              />
            </motion.div>
          )}

          {activeTab === 'todos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input 
                  value={newTodo} 
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a task (ex: Book flight)..."
                  className="flex-1"
                />
                <Button type="submit">Add</Button>
              </form>
              <div className="space-y-2">
                {(trip.todos || []).map((todo) => (
                  <div 
                    key={todo.id}
                    className="flex items-center gap-3 p-4 bg-warm-cream/40 rounded-2xl group transition-all"
                  >
                    <button onClick={() => toggleTodo(todo.id)} className="transition-transform active:scale-90">
                      {todo.completed ? <CheckSquare className="text-love-500" /> : <Square className="text-gray-300 hover:text-love-300" />}
                    </button>
                    <span className={clsx("flex-1", todo.completed && "line-through text-gray-400")}>{todo.text}</span>
                    <button onClick={() => removeTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Wishlist = () => {
  const [trips, setTrips] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: '', notes: '', todos: [] });
  const [selectedTripId, setSelectedTripId] = useState(null);

  // ÉCOUTE FIREBASE AU LIEU DE LOCALSTORAGE
  useEffect(() => {
    const tripsRef = ref(db, 'trips');
    return onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTrips(list);
      } else {
        setTrips([]);
      }
    });
  }, []);

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!newTrip.destination.trim()) return;
    
    // ENVOI À FIREBASE
    push(ref(db, 'trips'), {
      ...newTrip,
      createdAt: Date.now()
    });
    
    setNewTrip({ destination: '', notes: '', todos: [] });
    setIsAdding(false);
  };

  const handleUpdateTrip = (updatedTrip) => {
    const { id, ...data } = updatedTrip;
    // MISE À JOUR FIREBASE
    update(ref(db, `trips/${id}`), data);
  };

  const removeTrip = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this trip?")) {
      // SUPPRESSION FIREBASE
      remove(ref(db, `trips/${id}`));
    }
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-serif text-love-900">Trip Planner</h2>
          <p className="text-gray-500 mt-2 italic">Every destination is a new chapter of us.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6">
          <Plus size={20} /> Plan a Trip
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="bg-white p-8 rounded-3xl border border-love-100 shadow-sm space-y-6">
              <form onSubmit={handleAddTrip} className="space-y-4">
                <Input 
                  label="Destination" 
                  value={newTrip.destination} 
                  onChange={e => setNewTrip({...newTrip, destination: e.target.value})} 
                  placeholder="Where to next, love?" 
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit">Start Planning</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedTripId(trip.id)}
              className="bg-white rounded-[2rem] p-6 border border-warm-beige shadow-sm hover:shadow-xl hover:border-love-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <button 
                onClick={(e) => removeTrip(trip.id, e)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <MapPin size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-serif text-love-800 truncate">{trip.destination}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{trip.notes || "No notes yet..."}</p>
                  
                  <div className="flex gap-3 mt-4 text-xs font-medium text-gray-400">
                    {(trip.todos && trip.todos.length > 0) && (
                       <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                         <CheckSquare size={12} /> 
                         {trip.todos.filter(t => t.completed).length}/{trip.todos.length} Tasks
                       </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {trips.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-20 bg-warm-cream/20 rounded-[3rem] border-2 border-dashed border-warm-beige">
            <MapPin className="mx-auto text-warm-beige mb-4" size={48} />
            <p className="text-gray-400 italic">No trips planned yet. Click the button to start dreaming!</p>
          </div>
        )}
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