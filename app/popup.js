const Popup = ({ node, onClose, position }) => {
  if (!node) return null;

  return (
    <div style={{
      position: 'absolute',
      top: `${position.top}px`,
      left: `${position.left}px`,
      transform: 'translate(-50%, -100%)',
      backgroundColor: '#e0e0e0',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      textAlign: 'center'
    }}>
      <h2 style={{
        margin: '0 0 10px 0',
        fontSize: '18px',
        fontWeight: 'normal',
        color: '#333'
      }}>
        {node.name}
      </h2>
      <p>Value: {node.value} TWh</p>
      <button onClick={onClose} style={{
        marginTop: '10px',
        padding: '5px 10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#ccc',
        color: '#333',
        cursor: 'pointer'
      }}>
        Close
      </button>
    </div>
  );
};

export default Popup;