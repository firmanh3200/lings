
import React, { useState, useEffect } from 'react';

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="font-mono text-xl text-gray-400 text-center">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </div>
  );
};
