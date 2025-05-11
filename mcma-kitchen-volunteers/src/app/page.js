'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/get-events')
      .then(res => res.json())
      .then(data => setEvents(data || []))
      .catch(err => console.error('Fetch failed:', err));
  }, []);

  function toggleAttendance(row, index, checked) {
    fetch('/api/update-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, index, checked }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') alert('Attendance saved ✔');
        else alert('Error saving attendance');
      })
      .catch(() => alert('Network error'));
  }

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', background: '#f2f2f2' }}>
      <h2>MCMA Kitchen Volunteers</h2>

      {events.map((row, rowIndex) => {
        const [date, eventName, expected, lead, leadPhone,
          vol1, phone1, vol2, phone2, vol3, phone3, vol4, phone4, vol5, phone5,
          att1, att2, att3, att4, att5] = row;

        if (!eventName) return null;

        return (
          <div key={rowIndex} style={{ background: 'white', padding: '16px', marginBottom: '24px', borderRadius: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {eventName} ({date})
            </div>
            <div style={{ marginBottom: '8px', color: '#777' }}>Expected attendees: {expected}</div>

            {[vol1, phone1, att1, vol2, phone2, att2, vol3, phone3, att3, vol4, phone4, att4, vol5, phone5, att5]
              .reduce((acc, val, i, arr) => {
                if (i % 3 === 0) acc.push(arr.slice(i, i + 3));
                return acc;
              }, [])
              .map(([vol, phone, att], i) => (
                vol ? (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <label>
                      <input
                        type="checkbox"
                        defaultChecked={att === 'TRUE'}
                        onChange={e => toggleAttendance(rowIndex + 2, i + 1, e.target.checked)}
                      /> {vol}
                    </label>
                    <a href={`tel:${(phone || '').replace(/\D/g, '')}`} style={buttonStyle}>Call</a>
                  </div>
                ) : null
              ))}
          </div>
        );
      })}
    </div>
  );
}

const buttonStyle = {
  marginLeft: 'auto',
  background: '#0079c2',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.9em'
};
