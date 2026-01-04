import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  Armchair, Bed, Flower2, Lamp, Tv, Box, Trash2, RotateCcw, 
  Square, DoorOpen, Bath, Refrigerator, 
  Flame, Layout, RotateCw, Utensils, Construction
} from 'lucide-react';
import Button from '../components/ui/Button';

// Liste des meubles mise à jour avec les bonnes icônes
const FurnitureList = [
  // Architecture
  { id: 'wall', icon: Square, label: 'Wall' },
  { id: 'door', icon: DoorOpen, label: 'Door' },
  { id: 'stairs', icon: Construction, label: 'Stairs' }, // Icône de construction pour l'escalier
  // Salon / Chambre
  { id: 'sofa', icon: Armchair, label: 'Sofa' },
  { id: 'bed', icon: Bed, label: 'Bed' },
  { id: 'tv', icon: Tv, label: 'TV' },
  { id: 'plant', icon: Flower2, label: 'Plant' },
  { id: 'lamp', icon: Lamp, label: 'Lamp' },
  // Salle de bain
  { id: 'shower', icon: Bath, label: 'Shower' },
  { id: 'toilet', icon: Utensils, label: 'Toilet' }, // Utensils ou Layout peut servir de base visuelle
  // Cuisine & Repas
  { id: 'table', icon: Box, label: 'Table' },
  { id: 'chair', icon: Layout, label: 'Chair' },
  { id: 'fridge', icon: Refrigerator, label: 'Fridge' },
  { id: 'stove', icon: Flame, label: 'Stove' },
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
      rotation: 0 
    });
  };

  const rotateItem = (id, currentRotation, e) => {
    e.stopPropagation();
    update(ref(db, `virtual_home/${id}`), {
      rotation: (currentRotation + 90) % 360
    });
  };

  const removeItem = (id, e) => {
    e.stopPropagation();
    remove(ref(db, `virtual_home/${id}`));
  };

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
          <h2 className="text-3xl font-serif text-love-900 font-bold">Dream Home</h2>
          <p className="text-gray-500 italic">Build your world together.</p>
        </div>
        <Button variant="secondary" onClick={() => remove(ref(db, 'virtual_home'))}>
          <RotateCcw size={18} className="mr-2" /> Reset
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-warm-beige shadow-inner overflow-x-auto">
        {FurnitureList.map((f) => (
          <button 
            key={f.id} 
            onClick={() => addItem(f.id)} 
            className="flex flex-col items-center p-3 hover:bg-love-50 rounded-2xl transition-all min-w-[65px]"
          >
            <f.icon className="text-love-400" size={24} />
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{f.label}</span>
          </button>
        ))}
      </div>

      <div 
        ref={constraintsRef} 
        className="relative h-[650px] bg-slate-50 rounded-[3rem] border-4 border-white shadow-xl overflow-hidden touch-none"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      >
        {items.map((item) => {
          const config = FurnitureList.find(f => f.id === item.type);
          const Icon = config ? config.icon : Box;

          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(item.id, info, item.x, item.y)}
              style={{ position: 'absolute', left: 0, top: 0 }}
              animate={{ x: item.x, y: item.y, rotate: item.rotation || 0 }}
              className="cursor-move p-4"
            >
              <div className="relative group">
                <div className={item.type === 'wall' ? "bg-gray-800 w-32 h-3 rounded-full" : "text-love-900"}>
                  {item.type !== 'wall' && <Icon size={item.type === 'bed' || item.type === 'sofa' ? 60 : 45} />}
                </div>
                
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => rotateItem(item.id, item.rotation || 0, e)}
                    className="bg-white text-blue-500 rounded-full p-1.5 shadow-lg border border-blue-100 hover:bg-blue-50"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button 
                    onClick={(e) => removeItem(item.id, e)}
                    className="bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-100 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualHome;
