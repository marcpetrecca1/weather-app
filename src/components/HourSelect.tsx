import React from 'react';

interface HourProps {
  hour: number; //hour can only be 0, 4, 8, 12, 16, 20
  setHour: (hour: number) => any;
}

const HourSelect: React.FC<HourProps> = ({ hour, setHour }) => {
  console.log(hour);
  return (
    <div>
      <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
        <option value={0}>Midnight</option>
        <option value={4}>Early Morning</option>
        <option value={8}>Morning</option>
        <option value={12}>Afternoon</option>
        <option value={16}>Evening</option>
        <option value={20}>Late Evening</option>
      </select>
    </div>
  );
};

export default HourSelect;
