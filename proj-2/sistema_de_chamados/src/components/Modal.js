import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ content, close }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <button style={styles.modalClose} onClick={close}>
          <FiX size={23} color="#FFF" />
        </button>
        <h2 style={styles.modalTitle}>Detalhes</h2>
        <div style={styles.modalContent}>
          <p><strong>Status:</strong> {content?.status}</p>
          <p><strong>Chamado Aberto em:</strong> {content?.createdFormatted}</p>
          {content?.complement && (
            <>
              <h3 style={styles.modalSubtitle}>Informação Adicional</h3>
              <p>{content.complement}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    background: '#333',
    color: '#fff',
    borderRadius: '10px',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  modalClose: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5em',
    transition: 'color 0.3s',
  },
  modalCloseHover: {
    color: '#ff5722',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5em',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
  },
  modalContent: {
    marginTop: '20px',
  },
  modalSubtitle: {
    marginTop: '20px',
    fontSize: '1.2em',
  },
};

export default Modal;
