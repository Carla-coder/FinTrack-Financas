import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import firebase from '../services/firebaseConnection';
import { useParams, useNavigate } from 'react-router-dom';

const New = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState('');
  const [status, setStatus] = useState('');
  const [complement, setComplement] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      if (id) {
        await firebase.firestore().collection('products').doc(id).get()
          .then(snapshot => {
            setMaterial(snapshot.data().material);
            setStatus(snapshot.data().status);
            setComplement(snapshot.data().complement);
            setClientId(snapshot.data().clientId || '');
          })
          .catch(err => console.log('Error:', err));
      }
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    async function loadClients() {
      try {
        const snapshot = await firebase.firestore().collection('customers').get();
        let clientList = [];
        snapshot.forEach(doc => {
          clientList.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientList);
      } catch (err) {
        console.log('Error:', err);
      }
    }
    loadClients();
  }, []);

  async function handleSave() {
    setLoading(true);
    const selectedClient = clients.find(client => client.id === clientId);
    const clientName = selectedClient ? selectedClient.nomeFantasia : 'Cliente Desconhecido';

    const data = {
      material,
      status,
      complement,
      clientId,
      clientName, 
      created: new Date(),
    };

    try {
      if (id) {
        await firebase.firestore().collection('products').doc(id).update(data);
      } else {
        await firebase.firestore().collection('products').add(data);
      }
      navigate('/');
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <Title name={id ? 'Edit Product' : 'Novo Produto'} />
      <div style={styles.formContainer}>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={styles.form}>
          <label style={styles.label}>Cliente:</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Selecione um Cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nomeFantasia} - {client.cnpj}
              </option>
            ))}
          </select>
          <label style={styles.label}>Serviço:</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
            style={styles.input}
          />
          <label style={styles.label}>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Selecione o Status</option>
            <option value="Atendido">Pendente</option>
            <option value="Concluido">Concluido</option>
            <option value="Em Progresso">Em Progresso</option>
          </select>
          <label style={styles.label}>Complemento:</label>
          <textarea
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            style={styles.textarea}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    background: '#2c3e50',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  input: {
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '16px',
    background: '#333',
    color: '#fff',
  },
  select: {
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '16px',
    background: '#333',
    color: '#fff',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '16px',
    background: '#333',
    color: '#fff',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
  },
};

export default New;
