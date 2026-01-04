import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  Armchair, Bed, Flower2, Lamp, Tv, Box, Trash2, RotateCcw, 
  Square, DoorOpen, Bath, Refrigerator, Flame, Layout, 
  RotateCw, Construction, Maximize2, Minimize2, Layers, Window as WindowIcon, Monitor
} from 'lucide-react';
import Button from '../components/ui/Button';

const FurnitureList = [
  // Architecture
  { id: 'wall', icon: Square, label: 'Wall' },
  { id: 'door', icon: DoorOpen, label: 'Door' },
  { id: 'stairs', icon: Construction, label: 'Stairs' },
  { id: 'window', icon: WindowIcon, label: 'Window' },
  // Rangement & Niches
  { id: 'closet', icon: Layers, label: 'Armoire' },
  { id: 'niche', icon: Layout, label: 'Niche' },
  // Salon / Chambre
  { id: 'sofa', icon: Armchair, label: 'Sofa' },
  { id: 'bed', icon: Bed, label: 'Bed' },
  { id: 'desk', icon: Monitor, label: 'Desk' },
  { id: 'lamp', icon: Lamp, label: 'Lamp' },
  // Salle de bain (Icône Toilette Corrigée)
  { id: 'shower', icon: Bath, label: 'Shower' },
  { id: 'toilet', icon: Bath, label: 'Toilet' }, 
  // Cuisine & Repas
  { id: 'table', icon: Box, label: 'Table' },
  { id: 'fridge', icon: Refrigerator, label: 'Fridge' },
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
      } else { setItems([]); }
    });
  }, []);

  const addItem = (type) => {
    push(ref(db, 'virtual_home'), { 
      type, x: 100, y: 100, rotation: 0, scale: 1 
    });
  };

  const updateItem = (id, newData, e) => {
    if (e) e.stopPropagation();
    update(ref(db, `virtual_home/${id}`), newData);
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
          <h2 className="text-3xl font-serif text-love-900 font-bold">Dream Home Designer</h2>
          <p className="text-gray-500 italic">Resize, rotate and build our future.</p>
        </div>
        <Button variant="secondary" onClick={() => remove(ref(db, 'virtual_home'))}>
          <RotateCcw size={18} className="mr-2" /> Reset
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-warm-beige shadow-inner overflow-x-auto">
        {FurnitureList.map((f) => (
          <button key={f.id} onClick={() => addItem(f.id)} className="flex flex-col items-center p-3 hover:bg-love-50 rounded-2xl transition-all min-w-[70px]">
            <f.icon className="text-love-400" size={24} />
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{f.label}</span>
          </button>
        ))}
      </div>

      <div ref={constraintsRef} className="relative h-[700px] bg-slate-50 rounded-[3rem] border-4 border-white shadow-xl overflow-hidden touch-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        {items.map((item) => {
          const config = FurnitureList.find(f => f.id === item.type);
          const Icon = config ? config.icon : Box;
          const scale = item.scale || 1;

          return (
            <motion.div
              key={item.id} drag dragConstraints={constraintsRef} dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(item.id, info, item.x, item.y)}
              style={{ position: 'absolute', left: 0, top: 0 }}
              animate={{ x: item.x, y: item.y, rotate: item.rotation || 0, scale: scale }}
              className="cursor-move p-4"
            >
              <div className="relative group">
                <div className={item.type === 'wall' ? "bg-gray-800 w-32 h-3 rounded-full" : "text-love-900"}>
                  {item.type !== 'wall' && <Icon size={45} className="drop-shadow-sm" />}
                </div>
                
                {/* Menu de modification (Agrandir, Tourner, Supprimer) */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-full shadow-xl border border-warm-beige scale-75">
                  <button onClick={(e) => updateItem(item.id, { scale: scale + 0.2 }, e)} className="p-1.5 hover:text-love-500"><Maximize2 size={16} /></button>
                  <button onClick={(e) => updateItem(item.id, { scale: Math.max(0.4, scale - 0.2) }, e)} className="p-1.5 hover:text-love-500"><Minimize2 size={16} /></button>
                  <button onClick={(e) => updateItem(item.id, { rotation: (item.rotation + 45) % 360 }, e)} className="p-1.5 hover:text-blue-500"><RotateCw size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); remove(ref(db, `virtual_home/${item.id}`)); }} className="p-1.5 hover:text-red-500"><Trash2 size={16} /></button>
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
