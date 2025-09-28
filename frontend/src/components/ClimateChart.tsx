import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', CO2: 420, Temp: 24.5, Humidity: 55, AQI: 42 },
  { time: '10:05', CO2: 430, Temp: 24.7, Humidity: 54, AQI: 44 },
  { time: '10:10', CO2: 440, Temp: 25.0, Humidity: 53, AQI: 45 },
  { time: '10:15', CO2: 425, Temp: 24.8, Humidity: 52, AQI: 43 },
];

export default function ClimateChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="CO2" stroke="#8884d8" name="CO₂ (ppm)" />
        <Line type="monotone" dataKey="Temp" stroke="#82ca9d" name="Temp (°C)" />
        <Line type="monotone" dataKey="Humidity" stroke="#ffc658" name="Humidity (%)" />
        <Line type="monotone" dataKey="AQI" stroke="#ff7300" name="AQI" />
      </LineChart>
    </ResponsiveContainer>
  );
}
