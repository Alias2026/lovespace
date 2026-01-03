import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Plane, Home, Target, Mail, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group flex flex-col items-center p-2">
      <div className={clsx(
        "p-3 rounded-full transition-all duration-300",
        isActive ? "bg-love-100 text-love-600" : "text-gray-500 hover:text-love-400 hover:bg-love-50"
      )}>
        <Icon size={24} />
      </div>
      <span className={clsx(
        "text-xs mt-1 font-medium transition-colors duration-300",
        isActive ? "text-love-600" : "text-gray-400 group-hover:text-love-400"
      )}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 w-1 h-1 bg-love-500 rounded-full"
        />
      )}
    </Link>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-warm-beige shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-love-100 p-2 rounded-full">
              <Heart className="text-love-500 fill-current" size={24} />
            </div>
            <h1 className="text-2xl font-serif text-love-800 tracking-wide">Love Space</h1>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <NavItem to="/" icon={Heart} label="Home" />
            <NavItem to="/wishlist" icon={Plane} label="Travel" />
            <NavItem to="/letters" icon={Mail} label="Letters" />
            <NavItem to="/home" icon={Home} label="Virtual Home" />
            <NavItem to="/goals" icon={Target} label="Goals" />
            <NavItem to="/agenda" icon={Calendar} label="Agenda" />
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-warm-beige pb-safe z-50">
        <div className="flex justify-around items-center p-2">
          <NavItem to="/" icon={Heart} label="Home" />
          <NavItem to="/wishlist" icon={Plane} label="Travel" />
          <NavItem to="/letters" icon={Mail} label="Letters" />
          <NavItem to="/home" icon={Home} label="Home" />
          <NavItem to="/goals" icon={Target} label="Goals" />
          <NavItem to="/agenda" icon={Calendar} label="Agenda" />
        </div>
      </nav>
    </div>
  );
};

export default Layout;
