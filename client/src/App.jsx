import React, { useState } from 'react';
import ConnectionForm from './components/ConnectionForm';
import Collections from './components/Collections';

const App = () => {
  const [connectionInfo, setConnectionInfo] = useState(null); // { uri, collections }
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/health`).catch(() => {});
  }, []);
  console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

  return (
    <div className="container py-4">
      {!connectionInfo ? (
        <ConnectionForm setConnectionInfo={setConnectionInfo} />
      ) : (
        <Collections connectionInfo={connectionInfo} setConnectionInfo={setConnectionInfo} />
      )}
    </div>
  );
};

export default App;