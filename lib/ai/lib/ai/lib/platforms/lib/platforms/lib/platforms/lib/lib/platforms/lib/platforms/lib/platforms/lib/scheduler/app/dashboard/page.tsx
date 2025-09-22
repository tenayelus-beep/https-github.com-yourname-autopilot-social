// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch('/api/approve/list')
      .then(r => r.json())
      .then(setPending);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AutoPilot Social Dashboard</h1>
      <div>
        <h2 className="text-xl mb-4">Pending Approvals</h2>
        {pending.length === 0 ? (
          <p>No pending videos</p>
        ) : (
          <div>
            {pending.map((item: any) => (
              <div key={item.id} className="border p-4 mb-4">
                <h3>{item.content.title}</h3>
                <p>{item.content.script}</p>
                <button className="bg-green-500 text-white px-4 py-2 mr-2">Approve</button>
                <button className="bg-red-500 text-white px-4 py-2">Reject</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
