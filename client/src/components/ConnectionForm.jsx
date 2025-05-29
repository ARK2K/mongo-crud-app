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
      const res = await axios.post('http://localhost:5000/api/connect', { uri });
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
      await axios.post('http://localhost:5000/api/init', {
        uri,
        collectionName: newCollection.trim(),
        initialDoc: doc,
      });
      // Refresh collections
      const res = await axios.post('http://localhost:5000/api/connect', { uri });
      setConnectionInfo({ uri, collections: res.data.collections });
    } catch (err) {
      setMessage('Create failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h3>MongoDB Connection</h3>
      <input
        type="password"
        className="form-control mb-2"
        placeholder="MongoDB URI"
        value={uri}
        onChange={e => setUri(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleConnect}>
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
          <button className="btn btn-success" onClick={handleInit}>
            Create Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionForm;