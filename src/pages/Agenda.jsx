import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import clsx from 'clsx';

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

function getMonthMatrix(current) {
  const start = startOfMonth(current);
  const end = endOfMonth(current);
  const startWeekday = start.getDay();
  const daysInMonth = end.getDate();
  const days = [];
  // Adjust for week starting on Monday (Monday = 1, Sunday = 0)
  const offset = startWeekday === 0 ? 6 : startWeekday - 1;
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(current.getFullYear(), current.getMonth(), d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const DayCell = ({ date, events, color }) => {
  if (!date) return <div className="h-24 bg-gray-50/30 rounded-xl" />;
  const isToday = new Date().toDateString() === date.toDateString();
  
  const dateStr = date.toISOString().split('T')[0];
  const dayEvents = events.filter(e => e.date === dateStr);

  return (
    <div className={clsx(
      "h-24 p-2 rounded-xl border border-warm-beige transition-all overflow-hidden",
      isToday ? "bg-love-50 border-love-100 ring-1 ring-love-200" : "bg-white"
    )}>
      <span className={clsx("text-xs font-bold", isToday ? "text-love-500" : "text-gray-400")}>
        {date.getDate()}
      </span>
      <div className="mt-1 space-y-1">
        {dayEvents.map((e) => (
          <div key={e.id} className={clsx("text-[9px] px-1.5 py-0.5 rounded-md truncate shadow-sm font-medium", color)}>
            {e.title}
          </div>
        ))}
      </div>
    </div>
  );
};

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', owner: 'elias' });

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    return onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setEvents(list);
      } else {
        setEvents([]);
      }
    });
  }, []);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    push(ref(db, 'events'), newEvent);
    setNewEvent({ ...newEvent, title: '' });
  };

  const removeEvent = (id) => {
    if(window.confirm("Delete this event?")) {
      remove(ref(db, `events/${id}`));
    }
  };

  const eliasEvents = events.filter(e => e.owner === 'elias');
  const aprilEvents = events.filter(e => e.owner === 'april');
  const matrix = getMonthMatrix(currentDate);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 pb-20 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-serif text-love-900 font-bold flex items-center gap-3">
          <CalendarIcon size={32} /> Shared Agenda
        </h2>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-warm-beige">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><ChevronLeft /></button>
          <span className="font-serif text-lg min-w-[150px] text-center">
            {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><ChevronRight /></button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-love-100 shadow-sm">
        <form onSubmit={addEvent} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <Input label="Event" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Dinner, Flight, Date..." />
          <Input type="date" label="Date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
          <div className="space-y-1 text-left">
            <label className="text-sm font-medium text-gray-700 ml-1">For whom?</label>
            <select 
              className="w-full p-2.5 bg-warm-cream/20 border border-warm-beige rounded-xl focus:ring-2 focus:ring-love-200 outline-none"
              value={newEvent.owner} 
              onChange={e => setNewEvent({...newEvent, owner: e.target.value})}
            >
              <option value="elias">Elias</option>
              <option value="april">April</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Add Event</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elias Section */}
        <div className="space-y-4">
          <h4 className="font-serif text-xl text-love-800">Elias's Schedule</h4>
          <div className="grid grid-cols-7 gap-1 text-xs font-bold text-gray-400 mb-2 px-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {matrix.map((date, idx) => (
              <DayCell key={idx} date={date} events={eliasEvents} color="bg-love-100 text-love-600" />
            ))}
          </div>
        </div>

        {/* April Section */}
        <div className="space-y-4">
          <h4 className="font-serif text-xl text-love-800">April's Schedule</h4>
          <div className="grid grid-cols-7 gap-1 text-xs font-bold text-gray-400 mb-2 px-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {matrix.map((date, idx) => (
              <DayCell key={idx} date={date} events={aprilEvents} color="bg-blue-100 text-blue-600" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Upcoming list */}
      <div className="mt-10 bg-white p-6 rounded-3xl border border-warm-beige">
        <h4 className="font-serif text-xl text-love-900 mb-4">Upcoming</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {events.sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 6).map(e => (
            <div key={e.id} className="flex items-center justify-between p-3 bg-warm-cream/10 rounded-xl border border-warm-cream">
              <div className="flex items-center gap-3">
                <div className={clsx("w-2 h-2 rounded-full", e.owner === 'elias' ? "bg-love-400" : "bg-blue-400")} />
                <div>
                  <p className="font-medium text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.date}}</p>
                </div>
              </div>
              <button onClick={() => removeEvent(e.id)} className="text-gray-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
