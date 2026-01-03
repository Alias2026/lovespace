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
      x: 20, 
      y: 20 
    });
  };

  const removeItem = (id) => remove(ref(db, `virtual_home/${id}`));

  // LA CORRECTION EST ICI :
  const handleDragEnd = (id, info, currentX, currentY) => {
    // On ajoute le mouvement (offset) à la position actuelle
    update(ref(db, `virtual_home/${id}`), {
      x: currentX + info.offset.x,
      y: currentY + info.offset.y
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-love-900 font-bold">Our Virtual Home</h2>
        <Button variant="secondary" onClick={() => remove(ref(db, 'virtual_home'))}>
          <RotateCcw size={18} /> Reset
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl border border-warm-beige">
        {Furniture.map((f) => (
          <button key={f.id} onClick={() => addItem(f.id)} className="flex flex-col items-center p-2 hover:bg-warm-cream rounded-xl transition-colors">
            <f.icon className="text-love-400" size={24} />
            <span className="text-xs text-gray-500">{f.label}</span>
          </button>
        ))}
      </div>

      <div ref={constraintsRef} className="relative h-[600px] bg-warm-cream/20 rounded-[3rem] border-4 border-dashed border-warm-beige overflow-hidden">
        {items.map((item) => {
          const config = Furniture.find(f => f.id === item.type);
          const Icon = config ? config.icon : Box;

          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false} // Désactivé pour éviter les rebonds bizarres
              onDragEnd={(e, info) => handleDragEnd(item.id, info, item.x, item.y)}
              style={{ position: 'absolute', left: 0, top: 0 }}
              animate={{ x: item.x, y: item.y }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="cursor-move p-2"
            >
              <div className="relative group">
                <Icon size={48} className="text-love-800" />
                <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-sm">
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualHome;
