import React, { useState, useEffect } from 'react';
import ConnectionForm from './components/ConnectionForm';
import Collections from './components/Collections';

const App = () => {
  const [token, setToken] = useState(null); // Secure token from backend
  const [collections, setCollections] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/health`).catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      {!token ? (
        <ConnectionForm setToken={setToken} setCollections={setCollections} setMessage={setMessage} />
      ) : (
        <Collections
          token={token}
          collections={collections}
          setToken={setToken}
          setCollections={setCollections}
          setMessage={setMessage}
        />
      )}
      {message && <div className="alert alert-warning mt-3">{message}</div>}
    </div>
  );
};

export default App;