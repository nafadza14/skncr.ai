
import React from 'react';

export const Calendar: React.FC = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const currentDayIndex = today.getDay();
  const currentDate = today.getDate();

  // Generate a mock week based on current date
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(currentDate - currentDayIndex + i);
    return d.getDate();
  });

  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-center px-4 py-3">
        {days.map((day, i) => {
          const isToday = i === currentDayIndex;
          return (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-slate-300'}`}>
                {day}
              </span>
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300
                ${isToday 
                  ? 'bg-gradient-primary text-white shadow-soft scale-110 ring-4 ring-primary-soft' 
                  : 'text-slate-500 bg-white shadow-sm'}`}
              >
                {weekDates[i]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
