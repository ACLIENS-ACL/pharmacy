// ConfirmationModal.js
import React from 'react';
import './styles/style.css';

const ConfirmationModal = ({ isOpen, onCancel, onConfirmAddToCart, onConfirmNoAddToCart }) => {
  const handleBackdropClick = () => {
    onCancel();
  };

  return (
    <div className={`modal-wrapper ${isOpen ? 'show' : ''}`}>
      <div className="backdrop" onClick={handleBackdropClick}></div>
      <div className="modal-content">
        <p>Do you want to add it back to cart?</p>
        <button className='modal-buttons' onClick={onConfirmAddToCart}>Yes</button>
        <button className='modal-buttons' onClick={onConfirmNoAddToCart}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
