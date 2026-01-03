import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  Armchair, Bed, Flower2, Lamp, Tv, Box, Trash2, RotateCcw, 
  Square, DoorOpen, Staircase, Bath, hardDrive, Refrigerator, 
  Flame, Layout, Monitor, Window as WindowIcon
} from 'lucide-react';
import Button from '../components/ui/Button';

// On agrandit la collection d'objets
const Furniture = [
  // Architecture
  { id: 'wall', icon: Square, label: 'Wall', category: 'Arch' },
  { id: 'door', icon: DoorOpen, label: 'Door', category: 'Arch' },
  { id: 'stairs', icon: Staircase, label: 'Stairs', category: 'Arch' },
  { id: 'window', icon: WindowIcon, label: 'Window', category: 'Arch' },
  // Salon / Chambre
  { id: 'sofa', icon: Armchair, label: 'Sofa', category: 'Living' },
  { id: 'bed', icon: Bed, label: 'Bed', category: 'Living' },
  { id: 'tv', icon: Tv, label: 'TV', category: 'Living' },
  { id: 'plant', icon: Flower2, label: 'Plant', category: 'Living' },
  // Salle de bain
  { id: 'shower', icon: Bath, label: 'Shower', category: 'Bath' },
  { id: 'toilet', icon: Monitor, label: 'Toilet', category: 'Bath' }, // Monitor détourné car lucide n'a pas tjs de toilet direct
  // Cuisine
  { id: 'fridge', icon: Refrigerator, label: 'Fridge', category: 'Kitchen' },
  { id: 'stove', icon: Flame, label: 'Stove', category: 'Kitchen' },
];

const VirtualHome = () => {
  const [items, setItems] = useState([]);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const homeRef = ref(db, 'virtual_home');
    return onValue(homeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setItems(list);
      } else {
        setItems([]);
      }
    });
  }, []);

  const addItem = (type) => {
    push(ref(db, 'virtual_home'), { 
      type, 
      x: 50, 
      y: 50,
      rotation: 0 // On prépare pour pouvoir tourner les objets plus tard
    });
  };

  const removeItem = (id) => remove(ref(db, `virtual_home/${id}`));

  const handleDragEnd = (id, info, currentX, currentY) => {
    update(ref(db, `virtual_home/${id}`), {
      x: currentX + info.offset.x,
      y: currentY + info.offset.y
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-warm-beige">
        <div>
          <h2 className="text-3xl font-serif text-love-900 font-bold">Dream Home Designer</h2>
          <p className="text-gray-500 italic">Drag and drop to build our future together.</p>
        </div>
        <Button variant="secondary" onClick={() => remove(ref(db, 'virtual_home'))} className="flex gap-2">
          <RotateCcw size={18} /> Clear House
        </Button>
      </div>

      {/* Barre d'outils améliorée */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-2xl border border-warm-beige overflow-x-auto shadow-inner">
        {Furniture.map((f) => (
          <button 
            key={f.id} 
            onClick={() => addItem(f.id)} 
            className="flex flex-col items-center p-3 hover:bg-love-50 rounded-2xl transition-all group min-w-[70px]"
          >
            <f.icon className="text-love-400 group-hover:text-love-600 group-hover:scale-110 transition-all" size={28} />
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Zone de construction */}
      <div 
        ref={constraintsRef} 
        className="relative h-[700px] bg-slate-50 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} // Petit effet papier millimétré
      >
        {items.map((item) => {
          const config = Furniture.find(f => f.id === item.type);
          const Icon = config ? config.icon : Box;

          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(item.id, info, item.x, item.y)}
              style={{ position: 'absolute', left: 0, top: 0 }}
              animate={{ x: item.x, y: item.y }}
              className="cursor-move p-2 touch-none"
            >
              <div className="relative group">
                {/* Style spécial pour les murs */}
                <div className={clsx(
                  "p-2 rounded-lg transition-colors",
                  item.type === 'wall' ? "bg-gray-800 text-white w-24 h-4" : "text-love-900"
                )}>
                  {item.type !== 'wall' && <Icon size={item.type === 'bed' || item.type === 'sofa' ? 56 : 40} className="drop-shadow-sm" />}
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
            <Layout size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-serif italic">Our blank canvas... Add something above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualHome;
