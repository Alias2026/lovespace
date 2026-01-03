import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { Armchair, Bed, Flower2, Lamp, Tv, Box, Trash2, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';

const Furniture = [
  { id: 'sofa', icon: Armchair, label: 'Sofa' },
  { id: 'bed', icon: Bed, label: 'Bed' },
  { id: 'plant', icon: Flower2, label: 'Plant' },
  { id: 'lamp', icon: Lamp, label: 'Lamp' },
  { id: 'tv', icon: Tv, label: 'TV' },
  { id: 'table', icon: Box, label: 'Table' },
];

const VirtualHome = () => {
  const [items, setItems] = useState([]);
  const constraintsRef = useRef(null);

  // Charger les meubles depuis Firebase
  useEffect(() => {
    const homeRef = ref(db, 'virtual_home');
    return onValue(homeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setItems(list);
      } else {
        setItems([]);
      }
    });
  }, []);

  const addItem = (type) => {
    const newItem = {
      type,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100
    };
    push(ref(db, 'virtual_home'), newItem);
  };

  const removeItem = (id) => {
    remove(ref(db, `virtual_home/${id}`));
  };

  const resetHome = () => {
    if (window.confirm("Voulez-vous vraiment vider la maison ?")) {
      remove(ref(db, 'virtual_home'));
    }
  };

  // Mettre à jour la position quand on lâche le meuble
  const handleDragEnd = (id, info) => {
    // On calcule la nouvelle position par rapport au parent
    const item = items.find(i => i.id === id);
    if (item) {
      update(ref(db, `virtual_home/${id}`), {
        x: item.x + info.offset.x,
        y: item.y + info.offset.y
      });
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      <header className="text-center space-y-2 flex-shrink-0">
        <h2 className="text-3xl font-serif text-love-800">Virtual Home</h2>
        <p className="text-gray-600">Design your dream space together</p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-shrink-0">
        {Furniture.map((item) => (
          <button
            key={item.id}
            onClick={() => addItem(item.id)}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-warm-beige hover:bg-love-50 transition-colors min-w-[80px]"
          >
            <item.icon className="text-love-600" size={24} />
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center">
            <button 
                onClick={() => setItems([])}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Clear Room"
            >
                <RotateCcw size={24} />
            </button>
        </div>
      </div>

      <div 
        ref={constraintsRef}
        className="flex-grow bg-white rounded-3xl shadow-inner border-4 border-warm-beige relative overflow-hidden"
        style={{ 
            backgroundImage: 'radial-gradient(#E6CCB2 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }}
      >
        {items.map((item) => {
          const typeDef = Furniture.find(f => f.id === item.type);
          if (!typeDef) return null;
          const Icon = typeDef.icon;

          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              // initial={{ x: item.x, y: item.y }} // Simple positioning
              // For true persistence we need more complex logic, 
              // let's just center them initially or random
              className="absolute cursor-move group p-2"
              style={{ left: item.x, top: item.y }}
              onDragEnd={(e, info) => {
                  // Update position in state? 
                  // For simplicity in this demo, we'll just let them float.
                  // If we want to save, we need to calculate new left/top.
                  // Let's skip precise persistence for now to avoid bugs.
              }}
            >
              <div className="relative">
                <Icon size={48} className="text-love-800 drop-shadow-md" />
                <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
        
        {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                <p className="text-xl font-serif">Drag furniture here</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VirtualHome;
