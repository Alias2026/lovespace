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
  for (let i = 0; i < (startWeekday === 0 ? 6 : startWeekday - 1); i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(current.getFullYear(), current.getMonth(), d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const DayCell = ({ date, events, color }) => {
  if (!date) return <div className="h-24 bg-gray-50/30 rounded-xl" />;
  const isToday = new Date().toDateString() === date.toDateString();
  const dayEvents = events.filter(e => e.date === date.toISOString().split('T')[0]);

  return (
    <div className={clsx("h-24 p-2 rounded-xl border border-warm-beige transition-all overflow-hidden", isToday ? "bg-love-50 border-love-100" : "bg-white")}>
      <span className={clsx("text-xs font-bold", isToday ? "text-love-500" : "text-gray-400")}>{date.getDate()}</span>
      <div className="mt-1 space-y-1">
        {dayEvents.map((e, idx) => (
          <div key={idx} className={clsx("text-[10px] px-1.5 py-0.5 rounded-md truncate shadow-sm", color)}>
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
    setNewEvent({ title: '', date: '', time: '', owner: newEvent.owner });
  };

  const removeEvent = (id) => {
    remove(ref(db, `events/${id}`));
  };

  const eliasEvents = events.filter(e => e.owner === 'elias');
  const aprilEvents = events.filter(e => e.owner === 'april');
  const matrix = getMonthMatrix(currentDate);
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
