import React, { useEffect, useState } from 'react';

export default function ITInfraDashboard() {
  const [servers, setServers] = useState([
    { name: 'Server 1', cpu: 32, memory: 60, uptime: 120, anomaly: false },
    { name: 'Server 2', cpu: 85, memory: 90, uptime: 300, anomaly: true },
  ]);

  // Placeholder for fetching real data
  useEffect(() => {
    // Fetch server metrics from API in real implementation
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {servers.map((s) => (
          <div key={s.name} className={`bg-white p-4 rounded shadow ${s.anomaly ? 'border-2 border-red-500' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{s.name}</span>
              {s.anomaly && <span className="text-red-600 text-xs font-semibold">Anomaly!</span>}
            </div>
            <div>CPU: <span className="font-mono">{s.cpu}%</span></div>
            <div>Memory: <span className="font-mono">{s.memory}%</span></div>
            <div>Uptime: <span className="font-mono">{s.uptime}h</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500 mb-2">Anomaly Detection Chart (Coming Soon)</div>
        <div className="h-32 flex items-center justify-center text-gray-400">[Anomaly Chart Placeholder]</div>
      </div>
    </div>
  );
}
