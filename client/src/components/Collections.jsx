import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Documents from './Documents';

const Collections = ({ connectionInfo, setConnectionInfo }) => {
  const { uri, collections } = connectionInfo;
  const [selectedCollection, setSelectedCollection] = useState(collections[0]?.name || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (collections.length && !selectedCollection) {
      setSelectedCollection(collections[0].name);
    }
  }, [collections, selectedCollection]);

  const handleLogout = () => {
    setConnectionInfo(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Collections</h3>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Disconnect
        </button>
      </div>
      <select
        className="form-select mb-3"
        value={selectedCollection}
        onChange={e => setSelectedCollection(e.target.value)}
      >
        {collections.map(c => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedCollection ? (
        <Documents uri={uri} collectionName={selectedCollection} />
      ) : (
        <div>No collections available</div>
      )}
    </div>
  );
};

export default Collections;