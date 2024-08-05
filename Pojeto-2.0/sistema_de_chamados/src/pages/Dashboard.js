import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import Modal from '../components/Modal';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import firebase from '../services/firebaseConnection';

const listRef = firebase.firestore().collection('products').orderBy('created', 'desc');

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await listRef.limit(5).get();
        updateState(snapshot);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;
    if (!isCollectionEmpty) {
      let list = [];
      snapshot.forEach(doc => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          material: doc.data().material,
          created: doc.data().created,
          createdFormatted: new Date(doc.data().created.seconds * 1000).toLocaleDateString(),
          status: doc.data().status,
          complement: doc.data().complement,
          clientName: doc.data().clientName || 'Cliente Desconhecido',
        });
      });
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setProducts(prevProducts => [...prevProducts, ...list]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }
    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);
    try {
      const snapshot = await listRef.startAfter(lastDocs).limit(5).get();
      updateState(snapshot);
    } catch (err) {
      console.error('Error loading more products:', err);
    }
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  if (loading) {
    return (
      <div style={styles.dashboard}>
        <Title name="Atendimento" style={styles.title} />
        <div style={styles.container}>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <Title name="Chamados" style={styles.title} />
      {products.length === 0 ? (
        <div style={styles.container}>
          <span>Nenhum Produto Encontrado</span>
        </div>
      ) : (
        <>
          <div style={styles.cardsContainer}>
            {products.map((item) => (
              <div key={item.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{item.clientName}</h3>
                <p><strong>Serviço:</strong> {item.material}</p>
                <p><strong>Data:</strong> {item.createdFormatted}</p>
                <p><strong>Status:</strong> 
                  <span style={styles.status[item.status]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </p>
                <button style={styles.actionButton} onClick={() => togglePostModal(item)}>
                  Detalhes
                </button>
              </div>
            ))}
          </div>
          {loadingMore && <span style={styles.loadingMore}>Buscando...</span>}
          {!loadingMore && !isEmpty && (
            <button style={styles.loadMore} onClick={handleMore}>Buscar Mais</button>
          )}
        </>
      )}
      <Link to="/new" style={styles.addProduct}>
        <FiPlus size={30} />
      </Link>
      {showPostModal && <Modal content={detail} close={() => setShowPostModal(false)} onSave={() => { }} />}
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
    padding: '10px',
  },
  container: {
    margin: '20px',
    textAlign: 'center',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: '200px',
    textAlign: 'left',
  },
  cardTitle: {
    margin: '0 0 10px',
  },
  status: {
    atendido: {
      backgroundColor: '#4CAF50', 
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    emProgresso: {
      backgroundColor: '#FFC107', 
      color: '#000',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    concluido: {
      backgroundColor: '#2196F3',
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '4px',
    },
  },
  actionButton: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  loadMore: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '20px',
  },
  addProduct: {
    position: 'fixed',
    bottom: '110px',
    right: '20px',
    backgroundColor: '#ff5722',
    color: '#fff',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    textDecoration: 'none',
    fontSize: '24px',
    textAlign: 'center',
    lineHeight: '60px',
  },
  loadingMore: {
    color: '#fff',
    margin: '20px',
  }
};

export default Dashboard;
