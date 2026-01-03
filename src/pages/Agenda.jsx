import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import clsx from 'clsx';

const STORAGE_KEYS = {
  elias: 'love_space_agenda_elias',
  april: 'love_space_agenda_april',
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

function getMonthMatrix(current) {
  const start = startOfMonth(current);
  const end = endOfMonth(current);
  const startWeekday = start.getDay(); // 0=Sunday
  const daysInMonth = end.getDate();

  const days = [];
  // Fill leading blanks
  for (let i = 0; i < (startWeekday === 0 ? 6 : startWeekday - 1); i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(current.getFullYear(), current.getMonth(), d));
  }
  // Ensure full weeks
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const DayCell = ({ date, events, color, who, onRemove }) => {
  const day = date ? date.getDate() : '';
  const dateKey = date ? date.toISOString().slice(0,10) : null;
  const todaysEvents = dateKey ? (events.filter(e => e.date === dateKey)) : [];
  return (
    <div className="min-h-[80px] p-2 rounded-lg border border-warm-beige bg-white">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium">{day}</span>
        {todaysEvents.length > 0 && (
          <span className={clsx("px-2 py-0.5 rounded-full text-[10px]", color)}>{todaysEvents.length} evt</span>
        )}
      </div>
      <div className="space-y-1 max-h-[60px] overflow-y-auto">
        {todaysEvents.map((e) => (
          <div key={e.id} className="text-[11px] truncate flex items-center justify-between gap-1">
            <span className="truncate"><span className="text-gray-400">{e.time}</span> <span className="text-gray-700">{e.title}</span></span>
            <button onClick={() => onRemove(who, e.id)} className="text-gray-300 hover:text-red-400">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Agenda = () => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [eliasEvents, setEliasEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.elias);
    return saved ? JSON.parse(saved) : [];
  });
  const [aprilEvents, setAprilEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.april);
    return saved ? JSON.parse(saved) : [];
  });
  const [newEvent, setNewEvent] = useState({ who: 'elias', title: '', date: '', time: '', notes: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.elias, JSON.stringify(eliasEvents));
  }, [eliasEvents]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.april, JSON.stringify(aprilEvents));
  }, [aprilEvents]);

  const monthLabel = currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const matrix = getMonthMatrix(currentMonth);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;
    const entry = { id: Date.now(), ...newEvent };
    if (newEvent.who === 'elias') {
      setEliasEvents([...eliasEvents, entry].sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)));
    } else {
      setAprilEvents([...aprilEvents, entry].sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)));
    }
    setNewEvent({ who: newEvent.who, title: '', date: '', time: '', notes: '' });
  };

  const removeEvent = (who, id) => {
    if (who === 'elias') setEliasEvents(eliasEvents.filter(e => e.id !== id));
    else setAprilEvents(aprilEvents.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-love-800">Agenda</h2>
        <p className="text-gray-600">Two separate agendas for Elias and April</p>
      </header>

      {/* Add Event Form */}
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige space-y-4"
        onSubmit={addEvent}
      >
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <User size={18} className="text-love-500" />
            <select
              value={newEvent.who}
              onChange={e => setNewEvent({ ...newEvent, who: e.target.value })}
              className="px-3 py-2 rounded-lg border border-warm-sand bg-white/60"
            >
              <option value="elias">Elias</option>
              <option value="april">April</option>
            </select>
          </div>
          <Input
            placeholder="Event title"
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            className="flex-1 min-w-[150px]"
          />
          <Input
            type="date"
            value={newEvent.date}
            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Input
            type="time"
            value={newEvent.time}
            onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
          />
        </div>
        <TextArea
          placeholder="Notes (optional)"
          value={newEvent.notes}
          onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })}
        />
        <div className="flex justify-end">
          <Button type="submit">Add</Button>
        </div>
      </motion.form>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="p-2 rounded-full hover:bg-love-50 text-love-600"
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-love-500" />
            <h3 className="font-serif text-xl text-love-800">{monthLabel}</h3>
          </div>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="p-2 rounded-full hover:bg-love-50 text-love-600"
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Two Agendas Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Elias */}
        <div className="bg-white rounded-2xl shadow-sm border border-warm-beige">
          <div className="p-4 border-b border-warm-beige flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="text-love-500" />
              <h4 className="font-serif text-lg text-love-800">Agenda Elias</h4>
            </div>
            <span className="text-xs text-gray-500">{eliasEvents.length} événements</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {matrix.map((date, idx) => (
                <DayCell key={idx} date={date} events={eliasEvents} color="bg-love-100 text-love-600" who="elias" onRemove={removeEvent} />
              ))}
            </div>
          </div>
          {/* Elias upcoming list */}
          <div className="p-4 border-t border-warm-beige">
            <h5 className="text-sm text-gray-500 mb-2">Upcoming</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {eliasEvents.length === 0 && <p className="text-xs text-gray-400 italic">No events</p>}
              {eliasEvents.map(e => (
                <div key={e.id} className="flex items-center justify-between text-sm bg-warm-cream/60 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="text-love-500" size={16} />
                    <span className="text-gray-700">{e.title}</span>
                    <span className="text-gray-400">{e.date} {e.time}</span>
                  </div>
                  <button onClick={() => removeEvent('elias', e.id)} className="text-gray-300 hover:text-red-400">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* April */}
        <div className="bg-white rounded-2xl shadow-sm border border-warm-beige">
          <div className="p-4 border-b border-warm-beige flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="text-love-500" />
              <h4 className="font-serif text-lg text-love-800">Agenda April</h4>
            </div>
            <span className="text-xs text-gray-500">{aprilEvents.length} événements</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {matrix.map((date, idx) => (
                <DayCell key={idx} date={date} events={aprilEvents} color="bg-blue-100 text-blue-600" who="april" onRemove={removeEvent} />
              ))}
            </div>
          </div>
          {/* April upcoming list */}
          <div className="p-4 border-t border-warm-beige">
            <h5 className="text-sm text-gray-500 mb-2">Upcoming</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {aprilEvents.length === 0 && <p className="text-xs text-gray-400 italic">No events</p>}
              {aprilEvents.map(e => (
                <div key={e.id} className="flex items-center justify-between text-sm bg-warm-cream/60 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="text-love-500" size={16} />
                    <span className="text-gray-700">{e.title}</span>
                    <span className="text-gray-400">{e.date} {e.time}</span>
                  </div>
                  <button onClick={() => removeEvent('april', e.id)} className="text-gray-300 hover:text-red-400">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
