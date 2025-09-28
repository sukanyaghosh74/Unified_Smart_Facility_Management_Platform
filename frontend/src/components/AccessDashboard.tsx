import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AccessDashboard() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/access/visitors', { headers: { Authorization: `Bearer ${token}` } });
      setVisitorCount(res.data.length);
      // Fetch logs (placeholder)
      setLogs([
        { id: 1, name: 'John Doe', time: '2025-09-28 10:00', entry: 'in' },
        { id: 2, name: 'Jane Smith', time: '2025-09-28 09:45', entry: 'out' },
      ]);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Current Visitors</div>
          <div className="text-3xl font-bold">{visitorCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-2">
          <div className="text-gray-500 mb-2">Recent Access Logs</div>
          <ul>
            {logs.map((log: any) => (
              <li key={log.id} className="flex justify-between border-b py-1">
                <span>{log.name}</span>
                <span>{log.time}</span>
                <span className={log.entry === 'in' ? 'text-green-600' : 'text-red-600'}>{log.entry}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500 mb-2">QR Code Pass Generation (Coming Soon)</div>
        <div className="h-24 flex items-center justify-center text-gray-400">[QR Code Placeholder]</div>
      </div>
    </div>
  );
}
