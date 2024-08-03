import { useState } from "react";
import Title from "../components/Title";
import Header from "../components/Header";
import firebase from "../services/firebaseConnection";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Customers() {
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (nomeFantasia !== "" && cnpj !== "" && endereco !== "") {
      await firebase
        .firestore()
        .collection("customers")
        .add({
          nomeFantasia: nomeFantasia,
          cnpj: cnpj,
          endereco: endereco,
        })
        .then(() => {
          setNomeFantasia("");
          setCnpj("");
          setEndereco("");
          toast.success("Empresa cadastrada com sucesso!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao cadastrar essa empresa");
        });
    } else {
      toast.error("Preencha todos os campos!");
    }
  }

  return (
    <div style={styles.customers}>
      <Header />
      <div style={styles.content}>
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>
        <div style={styles.container}>
          <form style={styles.form} onSubmit={handleAdd}>
            <label style={styles.label}>Nome do Cliente</label>
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label}>CNPJ</label>
            <input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label}>Endereço</label>
            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  customers: {
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    flexGrow: 1,
  },
  container: {
    width: '90%',
    maxWidth: '90%',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#2c3e50',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginLeft: '-10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ff5722',
  },
  input: {
    marginBottom: '16px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#fff',
    color: '#333',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    fontSize: '18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff5722',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '15px',
      maxWidth: '90%',
      marginLeft: '-5px',
    },
    input: {
      fontSize: '14px',
      padding: '10px',
    },
    button: {
      fontSize: '16px',
      padding: '10px',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '10px',
      maxWidth: '95%',
      marginLeft: '0', 
    },
    input: {
      fontSize: '12px',
      padding: '8px',
    },
    button: {
      fontSize: '14px',
      padding: '8px',
    },
  }
};
