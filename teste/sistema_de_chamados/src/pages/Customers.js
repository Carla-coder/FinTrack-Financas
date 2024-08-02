import React, { useState } from 'react';
import Title from '../components/Title';
import { FiPlus } from 'react-icons/fi';
import Modal from '../components/Modal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', cnpj: '', address: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.cnpj && newCustomer.address) {
      setCustomers([...customers, newCustomer]);
      setNewCustomer({ name: '', cnpj: '', address: '' });
      setShowModal(false);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.dashboard}>
      <Title name="Customers" style={styles.title}>
        <FiPlus size={25} color="#fff" />
      </Title>
      <div style={styles.container}>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>CNPJ</th>
                <th style={styles.th}>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td style={styles.td}>{customer.name}</td>
                  <td style={styles.td}>{customer.cnpj}</td>
                  <td style={styles.td}>{customer.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <Modal isOpen={showModal} close={handleCloseModal} onSave={addCustomer} content={
            <>
              <h2 style={styles.modalTitle}>Add Customer</h2>
              <label style={styles.label}>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                CNPJ:
                <input
                  type="text"
                  name="cnpj"
                  value={newCustomer.cnpj}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Address:
                <input
                  type="text"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </label>
            </>
          } />
        )}
      </div>
      <button style={styles.addButton} onClick={handleAddClick}>
        <FiPlus size={30} color="#FFF" />
      </button>
    </div>
  );
};

const styles = {
  dashboard: {
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    color: '#fff',
    position: 'relative',
    paddingBottom: '80px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
  },
  container: {
    margin: '20px',
    textAlign: 'center',
  },
  tableContainer: {
    margin: '20px auto',
    maxWidth: '80%',
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#2c3e50',
    color: '#fff',
  },
  th: {
    background: 'linear-gradient(135deg, #ff5722, #ff9800)',
    color: '#fff',
    padding: '16px',
    textAlign: 'left',
    borderBottom: '2px solid #444',
  },
  td: {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '1px solid #444',
  },
  addButton: {
    position: 'fixed',
    bottom: '120px',
    right: '100px',
    backgroundColor: '#ff5722',
    color: '#fff',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  modalTitle: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  modalButtons: {
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
  }
};

export default Customers;
