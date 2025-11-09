'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHeartbeat = async () => {
      try {
        const response = await fetch('/api/supabase-heartbeat');
        const data = await response.json();
        setIsHealthy(data.success === true);
      } catch (error) {
        setIsHealthy(false);
      }
    };

    checkHeartbeat();
    // Optionally check every 5 seconds
    const interval = setInterval(checkHeartbeat, 5000);
    return () => clearInterval(interval);
  }, []);

  const backgroundColor = isHealthy === null 
    ? 'gray' 
    : isHealthy 
    ? 'green' 
    : 'red';

  return (
    <main 
      style={{ 
        minHeight: '100vh', 
        display: 'grid', 
        placeItems: 'center',
        backgroundColor: backgroundColor,
        transition: 'background-color 0.3s ease'
      }}
    >
      <div style={{ 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h1>Hello World</h1>
        <p style={{ marginTop: '1rem' }}>
          Supabase Status: {isHealthy === null ? 'Checking...' : isHealthy ? '✅ Connected' : '❌ Disconnected'}
        </p>
      </div>
    </main>
  );
}
