import React, { useState } from 'react';
import ConnectionForm from './components/ConnectionForm';
import Collections from './components/Collections';

const App = () => {
  const [connectionInfo, setConnectionInfo] = useState(null); // { uri, collections }

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