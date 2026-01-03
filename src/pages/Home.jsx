import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Stars, Cloud, MapPin, Timer } from 'lucide-react';

const Home = () => {
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 01/01/2026 at 06:24 France time (UTC+1 in winter)
    const startDate = new Date('2026-01-01T06:24:00+01:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = now - startDate;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 pb-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute -top-10 -left-10 text-love-200 animate-float" style={{ animationDelay: '0s' }}>
          <Cloud size={64} />
        </div>
        <div className="absolute -bottom-5 -right-10 text-love-200 animate-float" style={{ animationDelay: '2s' }}>
          <Cloud size={48} />
        </div>
        <div className="bg-white p-10 rounded-full shadow-xl border-4 border-love-100">
          <Heart size={80} className="text-love-500 fill-love-100" />
        </div>
      </motion.div>

      <div className="space-y-4 max-w-lg">
        <motion.h1 
          className="text-4xl md:text-5xl font-serif text-love-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome my love.
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 font-light"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Have fun
        </motion.p>
      </div>

      {/* Love Stats Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Time Together */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-love-100 flex flex-col items-center gap-3">
          <div className="bg-love-50 p-3 rounded-full text-love-500">
            <Timer size={24} />
          </div>
          <h3 className="font-serif text-lg text-love-800">Together For</h3>
          <div className="flex gap-4 text-center">
            <div>
              <span className="block text-2xl font-bold text-love-600">{timeTogether.days}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Days</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-love-600">{timeTogether.hours}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Hours</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-love-600">{timeTogether.minutes}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Mins</span>
            </div>
             <div>
              <span className="block text-2xl font-bold text-love-600">{timeTogether.seconds}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Secs</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <p className="text-sm text-gray-500">Since Jan 01, 2026</p>
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">🇫🇷 06:24</span>
              <span className="text-love-200">•</span>
              <span className="flex items-center gap-1">🇵🇭 13:24</span>
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-love-100 flex flex-col items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-full text-blue-500">
            <MapPin size={24} />
          </div>
          <h3 className="font-serif text-lg text-love-800">Distance Apart</h3>
          <div className="text-center">
             <span className="block text-3xl font-bold text-blue-600 mb-1">10,736 km</span>
             <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
               <span>France</span>
               <span className="text-blue-300">✈️</span>
               <span>Philippines</span>
             </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[
          { label: "Plan Trips", icon: "✈️" },
          { label: "Write Notes", icon: "💌" },
          { label: "Build Home", icon: "🏠" },
          { label: "Set Goals", icon: "🎯" }
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-warm-beige flex flex-col items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <span className="font-serif text-love-700">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
