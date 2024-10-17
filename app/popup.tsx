const Popup = ({ node, onClose, position }) => {
  if (!node) return null;

  // value를 반올림
  const roundedValue = Math.round(node.value);

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
      <p>자산: $ {roundedValue}</p>

      <select style={{
        marginTop: '10px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%'
      }}>
        <option value="nvidia">NVIDIA</option>
        <option value="amd">AMD</option>
        <option value="broadcom">Broadcom</option>
      </select>

      <button onClick={onClose} style={{
        marginTop: '10px',
        padding: '5px 10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#ccc',
        color: '#333',
        cursor: 'pointer'
      }}>
        닫기
      </button>
    </div>
  );
};

export default Popup;