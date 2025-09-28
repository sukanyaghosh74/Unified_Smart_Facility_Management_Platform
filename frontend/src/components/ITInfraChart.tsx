import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

const data = [
  { time: '10:00', CPU: 32, Memory: 60, Uptime: 120, Anomaly: false },
  { time: '10:05', CPU: 85, Memory: 90, Uptime: 121, Anomaly: true },
  { time: '10:10', CPU: 40, Memory: 65, Uptime: 122, Anomaly: false },
  { time: '10:15', CPU: 35, Memory: 62, Uptime: 123, Anomaly: false },
];

export default function ITInfraChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="CPU" stroke="#8884d8" name="CPU (%)" />
        <Line type="monotone" dataKey="Memory" stroke="#82ca9d" name="Memory (%)" />
        <Line type="monotone" dataKey="Uptime" stroke="#ffc658" name="Uptime (h)" />
        {data.map((entry, idx) => entry.Anomaly && (
          <ReferenceDot key={idx} x={entry.time} y={entry.CPU} r={8} fill="#ff0000" stroke="none" label={{ value: 'Anomaly', position: 'top' }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
