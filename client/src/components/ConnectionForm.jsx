import React, { useState } from 'react';
import axios from 'axios';

const ConnectionForm = ({ setConnectionInfo }) => {
  const [uri, setUri] = useState('');
  const [message, setMessage] = useState('');
  const [showInitForm, setShowInitForm] = useState(false);
  const [newCollection, setNewCollection] = useState('');
  const [initialDoc, setInitialDoc] = useState('{}');

  const handleConnect = async () => {
    setMessage('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/connect`, { uri });
      if (res.data.collections.length === 0) {
        setShowInitForm(true);
      } else {
        setConnectionInfo({ uri, collections: res.data.collections });
      }
    } catch (err) {
      setMessage('Connection failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInit = async () => {
    setMessage('');
    try {
      const doc = JSON.parse(initialDoc);
      if (!newCollection.trim()) return setMessage('Collection name required');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/init`, {
        uri,
        collectionName: newCollection.trim(),
        initialDoc: doc,
      });
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/connect`, { uri });
      setConnectionInfo({ uri, collections: res.data.collections });
    } catch (err) {
      setMessage('Create failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="p-4 rounded shadow bg-white" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="mb-3 text-center">MongoDB Connection</h3>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="MongoDB URI"
          value={uri}
          onChange={e => setUri(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleConnect}>
          Connect
        </button>
        <div className="text-danger mt-2">{message}</div>

        {showInitForm && (
          <div className="mt-4 border p-3 rounded bg-light">
            <h5>Create initial collection</h5>
            <input
              className="form-control mb-2"
              placeholder="Collection name"
              value={newCollection}
              onChange={e => setNewCollection(e.target.value)}
            />
            <textarea
              rows={4}
              className="form-control mb-2"
              value={initialDoc}
              onChange={e => setInitialDoc(e.target.value)}
              placeholder="Initial document JSON"
            />
            <button className="btn btn-success w-100" onClick={handleInit}>
              Create Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionForm;