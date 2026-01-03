import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Briefcase, CalendarHeart, Cloud, Plus, CheckCircle2, Circle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import clsx from 'clsx';

const GoalTypes = {
  trip: { icon: Plane, label: 'Trip', color: 'bg-blue-100 text-blue-600' },
  project: { icon: Briefcase, label: 'Project', color: 'bg-amber-100 text-amber-600' },
  anniversary: { icon: CalendarHeart, label: 'Anniversary', color: 'bg-love-100 text-love-600' },
  dream: { icon: Cloud, label: 'Dream', color: 'bg-purple-100 text-purple-600' },
};

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('love_space_goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', date: '', type: 'dream' });

  useEffect(() => {
    localStorage.setItem('love_space_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    setGoals([...goals, { ...newGoal, id: Date.now(), completed: false }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewGoal({ title: '', date: '', type: 'dream' });
    setIsAdding(false);
  };

  const toggleComplete = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-love-800">Future Goals & Dreams</h2>
        <p className="text-gray-600">Building our future together</p>
      </header>

      <div className="flex justify-center">
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)} className="animate-pulse">
            <Plus size={18} /> Add New Goal
          </Button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige w-full max-w-md space-y-4"
            onSubmit={handleAdd}
          >
            <h3 className="font-serif text-lg text-love-700">What's our next milestone?</h3>
            <Input 
              placeholder="Goal Title" 
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              autoFocus
            />
            <Input 
              type="date"
              value={newGoal.date}
              onChange={(e) => setNewGoal({...newGoal, date: e.target.value})}
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(GoalTypes).map(([key, type]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewGoal({...newGoal, type: key})}
                  className={clsx(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                    newGoal.type === key ? type.color + " ring-2 ring-offset-1 ring-gray-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  <type.icon size={14} />
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Add Goal</Button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Timeline */}
      <div className="relative max-w-2xl mx-auto pl-8 border-l-2 border-warm-beige space-y-8 py-4">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const TypeIcon = GoalTypes[goal.type]?.icon || Cloud;
            const typeColor = GoalTypes[goal.type]?.color || 'bg-gray-100 text-gray-500';
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={clsx(
                  "absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10",
                  goal.completed ? "bg-love-500" : "bg-warm-sand"
                )} />

                <div className={clsx(
                  "bg-white p-5 rounded-xl shadow-sm border border-warm-beige transition-all hover:shadow-md",
                  goal.completed && "opacity-60 grayscale-[0.5]"
                )}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx("p-1.5 rounded-full text-xs", typeColor)}>
                          <TypeIcon size={14} />
                        </span>
                        <span className="text-sm text-gray-400 font-mono">
                          {goal.date ? new Date(goal.date).toLocaleDateString() : 'Someday'}
                        </span>
                      </div>
                      <h4 className={clsx(
                        "text-lg font-serif",
                        goal.completed ? "text-gray-500 line-through" : "text-love-900"
                      )}>
                        {goal.title}
                      </h4>
                    </div>
                    
                    <button 
                      onClick={() => toggleComplete(goal.id)}
                      className={clsx(
                        "text-love-500 hover:scale-110 transition-transform",
                        goal.completed ? "opacity-100" : "opacity-40 hover:opacity-100"
                      )}
                    >
                      {goal.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    
                     <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-300 hover:text-red-400 ml-2"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {goals.length === 0 && !isAdding && (
          <div className="text-center py-10 text-gray-400 italic">
            Add your first shared goal to start the timeline...
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
