import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Documents = ({ uri, collectionName }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [docInput, setDocInput] = useState('{}');
  const [editId, setEditId] = useState(null);
  const [editDoc, setEditDoc] = useState('{}');

  const fetchDocuments = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/documents', { uri, collectionName });
      setDocuments(res.data.documents);
    } catch (err) {
      setMessage('Failed to fetch documents: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [uri, collectionName]);

  const handleCreate = async () => {
    setMessage('');
    try {
      const document = JSON.parse(docInput);
      await axios.post('http://localhost:5000/api/create', { uri, collectionName, document });
      setDocInput('{}');
      fetchDocuments();
    } catch (err) {
      setMessage('Create failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const startEdit = (doc) => {
    setEditId(doc._id);
    setEditDoc(JSON.stringify(doc, null, 2));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDoc('{}');
  };

  const handleUpdate = async () => {
    setMessage('');
    try {
      const updatedDocument = JSON.parse(editDoc);
      delete updatedDocument._id;  // Remove _id before sending
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/update`, {
        uri,
        collectionName,
        id: editId,
        updatedDocument,
      });
      setEditId(null);
      setEditDoc('{}');
      fetchDocuments();
    } catch (err) {
      setMessage('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/delete', { uri, collectionName, id });
      fetchDocuments();
    } catch (err) {
      setMessage('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h4>Documents in "{collectionName}"</h4>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <div>Loading documents...</div>
      ) : (
        <>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
            {documents.length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <ul className="list-group">
                {documents.map((doc) => (
                  <li
                    key={doc._id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <pre style={{ whiteSpace: 'pre-wrap', flex: 1, margin: 0 }}>
                      {JSON.stringify(doc, null, 2)}
                    </pre>
                    <div className="btn-group btn-group-sm ms-2" role="group">
                      <button className="btn btn-warning" onClick={() => startEdit(doc)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(doc._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {editId ? (
            <div>
              <h5>Edit Document</h5>
              <textarea
                rows={6}
                className="form-control"
                value={editDoc}
                onChange={(e) => setEditDoc(e.target.value)}
              />
              <button className="btn btn-success mt-2 me-2" onClick={handleUpdate}>
                Update
              </button>
              <button className="btn btn-secondary mt-2" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h5>Add New Document</h5>
              <textarea
                rows={6}
                className="form-control"
                value={docInput}
                onChange={(e) => setDocInput(e.target.value)}
                placeholder='Enter JSON document, e.g. { "name": "John", "age": 30 }'
              />
              <button className="btn btn-primary mt-2" onClick={handleCreate}>
                Create
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Documents;