import React, { useState } from 'react';
import axios from 'axios';

const ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Security', value: 'security' },
  { label: 'Facility Manager', value: 'facility_manager' },
];

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('facility_manager');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', null, {
        params: { username, password, role },
      });
      setSuccess('Registration successful!');
      onRegister();
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}
