import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Star, Cloud, X, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import clsx from 'clsx';

const Icons = {
  heart: Heart,
  star: Star,
  cloud: Cloud,
  mail: Mail,
};

const Letters = () => {
  const [letters, setLetters] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [readingId, setReadingId] = useState(null);
  const [newLetter, setNewLetter] = useState({ subject: '', content: '', icon: 'heart' });

  // Écoute Firebase
  useEffect(() => {
    const lettersRef = ref(db, 'letters');
    return onValue(lettersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setLetters(list.reverse()); // Les plus récentes en haut
      } else {
        setLetters([]);
      }
    });
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newLetter.subject.trim() || !newLetter.content.trim()) return;

    push(ref(db, 'letters'), {
      ...newLetter,
      date: new Date().toLocaleDateString('fr-FR')
    });

    setNewLetter({ subject: '', content: '', icon: 'heart' });
    setIsComposing(false);
  };

  const deleteLetter = (id) => {
    if (window.confirm("Supprimer cette lettre définitivement ?")) {
      remove(ref(db, `letters/${id}`));
      setReadingId(null);
    }
  };
  
  return (
    <div className="space-y-6 relative min-h-[500px]">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-love-800">Love Letters & Notes</h2>
        <p className="text-gray-600">Words from the heart</p>
      </header>

      {!isComposing && !readingId && (
        <div className="flex justify-center mb-8">
          <Button onClick={() => setIsComposing(true)} className="animate-pulse">
            <Plus size={18} /> Write a Letter
          </Button>
        </div>
      )}

      {/* Compose Form */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg border border-love-100 relative">
              <button 
                onClick={() => setIsComposing(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h3 className="font-serif text-2xl text-love-800 mb-6 text-center">New Letter</h3>
              
              <form onSubmit={handleSend} className="space-y-4">
                <Input 
                  placeholder="Subject" 
                  value={newLetter.subject}
                  onChange={e => setNewLetter({...newLetter, subject: e.target.value})}
                />
                
                <div className="flex gap-4 justify-center py-2">
                  {Object.entries(Icons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewLetter({...newLetter, icon: key})}
                      className={clsx(
                        "p-3 rounded-full transition-all",
                        newLetter.icon === key ? "bg-love-100 text-love-600 ring-2 ring-love-200" : "bg-gray-50 text-gray-400 hover:bg-love-50"
                      )}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>

                <TextArea 
                  placeholder="Write your message here..." 
                  value={newLetter.content}
                  onChange={e => setNewLetter({...newLetter, content: e.target.value})}
                  className="font-hand text-xl leading-relaxed min-h-[200px]"
                />
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="w-full sm:w-auto">Send with Love</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {letters.map((letter) => {
          const Icon = Icons[letter.icon] || Mail;
          return (
            <motion.div
              key={letter.id}
              layoutId={`letter-${letter.id}`}
              onClick={() => setReadingId(letter.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-warm-beige cursor-pointer hover:shadow-md hover:border-love-200 transition-all group relative"
            >
               <div className="absolute -top-3 -right-3 bg-love-100 p-2 rounded-full text-love-500 shadow-sm group-hover:scale-110 transition-transform">
                <Icon size={20} />
              </div>
              <h4 className="font-serif text-lg text-gray-800 mb-2">{letter.subject}</h4>
              <p className="text-xs text-gray-400">{letter.date}</p>
              <div className="mt-4 h-1 w-full bg-love-50 rounded-full overflow-hidden">
                <div className="h-full bg-love-200 w-1/3"></div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {letters.length === 0 && !isComposing && (
         <div className="text-center py-10 text-gray-400">
           <p>Your mailbox is empty. Write something sweet!</p>
         </div>
      )}

      {/* Reading Modal */}
      <AnimatePresence>
        {readingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            {letters.filter(l => l.id === readingId).map(letter => {
              const Icon = Icons[letter.icon] || Mail;
              return (
                <motion.div
                  layoutId={`letter-${letter.id}`}
                  key={letter.id}
                  className="bg-warm-cream p-8 rounded-2xl shadow-xl w-full max-w-lg border-2 border-white relative max-h-[80vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                   <button 
                    onClick={() => setReadingId(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                  <button
                    onClick={() => deleteLetter(letter.id)}
                     className="absolute top-4 left-4 text-love-200 hover:text-love-500"
                  >
                     <X size={16} />
                  </button>

                  <div className="text-center mb-6">
                    <Icon size={40} className="text-love-400 mx-auto mb-4" />
                    <h3 className="font-serif text-2xl text-love-800">{letter.subject}</h3>
                    <p className="text-sm text-gray-400 mt-1">{letter.date}</p>
                  </div>
                  
                  <div className="prose prose-p:font-hand prose-p:text-2xl prose-p:text-gray-700">
                    <p className="whitespace-pre-wrap">{letter.content}</p>
                  </div>
                  
                  <div className="mt-8 text-center text-love-300">
                    <Heart size={16} className="inline fill-current" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Letters;
