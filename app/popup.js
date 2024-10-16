import React from 'react';

const Popup = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'blue',
      color: 'black', 
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h2>{node.name}</h2>
      <p>Value: {node.value} TWh</p>
      <p>Category: {node.category}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Popup;