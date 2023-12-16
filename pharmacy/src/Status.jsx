// ConfirmationModal.js
import React from 'react';
import './styles/style.css';

const Status = ({ isOpen,Status, onCancel}) => {
  const handleBackdropClick = () => {
    onCancel();
  };

  return (
    <div className={`modal-wrapper ${isOpen ? 'show' : ''}`}>
      <div className="backdrop" onClick={handleBackdropClick}></div>
      <div className="modal-content">
        <p>Your Request is still "{Status}"</p>
        <button className='modal-buttons' onClick={handleBackdropClick}>Ok</button>
      </div>
    </div>
  );
};

export default Status;
