import React, { useEffect, useState } from 'react';
import ClimateChart from './ClimateChart';

export default function ClimateDashboard() {
  const [sensors, setSensors] = useState([
    { type: 'CO₂', value: 420, unit: 'ppm' },
    { type: 'Temperature', value: 24.5, unit: '°C' },
    { type: 'Humidity', value: 55, unit: '%' },
    { type: 'AQI', value: 42, unit: '' },
  ]);

  // Placeholder for fetching real data
  useEffect(() => {
    // Fetch sensor data from API in real implementation
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {sensors.map((s) => (
          <div key={s.type} className="bg-white p-4 rounded shadow text-center">
            <div className="text-gray-500">{s.type}</div>
            <div className="text-2xl font-bold">{s.value} {s.unit}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500 mb-2">Historical Data Charts</div>
        <ClimateChart />
      </div>
    </div>
  );
}
