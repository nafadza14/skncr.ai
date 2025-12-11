
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
    <div className="w-full bg-[#3e2e38] text-white rounded-b-[2rem] pt-6 pb-8 px-4 shadow-lg mb-6 -mx-6 w-[calc(100%+3rem)]">
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex gap-2 items-center">
            <span className="text-xl font-bold">Today</span>
        </div>
        <div className="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
      </div>

      <div className="flex justify-between items-center text-center">
        {days.map((day, i) => {
          const isToday = i === currentDayIndex;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium opacity-60">{day}</span>
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all
                ${isToday ? 'bg-white text-primary scale-110 shadow-md' : 'text-white/80'}`}
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
