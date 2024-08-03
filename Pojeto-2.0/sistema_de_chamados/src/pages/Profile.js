import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100?text=Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('profile')) || {};
    setProfileImage(storedProfile.profileImage || "https://via.placeholder.com/100?text=Profile");
    setName(storedProfile.name || "Nome Completo");
    setEmail(storedProfile.email || "nome@example.com");
    setAddress(storedProfile.address || "Endereço Completo");
  }, []);

  useEffect(() => {
    const profile = {
      profileImage,
      name,
      email,
      address,
    };
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profileImage, name, email, address]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleImageSelect = (imageUrl) => {
    setProfileImage(imageUrl);
    setIsModalOpen(false);
  };

  const handleEditProfile = () => {
    setName(newName);
    setEmail(newEmail);
    setAddress(newAddress);
    setIsEditing(false);
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Perfil</h1>
      </div>
      <div style={styles.container}>
        <div style={styles.imageContainer} onClick={handleImageClick}>
          <img src={profileImage} alt="Profile" style={styles.image} />
        </div>
        <form style={styles.formProfile}>
          <label style={styles.label}>Nome:</label>
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={styles.input}
            />
          ) : (
            <input type="text" value={name} readOnly style={styles.input} />
          )}
          <label style={styles.label}>Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={styles.input}
            />
          ) : (
            <input type="email" value={email} readOnly style={styles.input} />
          )}
          <label style={styles.label}>Endereço:</label>
          {isEditing ? (
            <textarea
              rows="4"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              style={styles.textarea}
            />
          ) : (
            <textarea rows="4" value={address} readOnly style={styles.textarea} />
          )}
          {isEditing ? (
            <button type="button" onClick={handleEditProfile} style={styles.button}>Salvar</button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} style={styles.button}>Editar Perfil</button>
          )}
        </form>
        {isModalOpen && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h2 style={styles.modalTitle}>Escolha uma Logo</h2>
              <div style={styles.imageOptions}>
                <img
                  src="https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGNhdfGVufDB8fHx8MTY5MzAwNzk4Ng&ixlib=rb-1.2.1&q=80&w=400"
                  alt="Cachorro"
                  style={styles.modalImage}
                  onClick={() => handleImageSelect("https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGNhdfGVufDB8fHx8MTY5MzAwNzk4Ng&ixlib=rb-1.2.1&q=80&w=400")}
                />
                <img
                  src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fGdhd98ZW58MHx8fDE2NjY3MTQ3MjA&ixlib=rb-1.2.1&q=80&w=400"
                  alt="Gato"
                  style={styles.modalImage}
                  onClick={() => handleImageSelect("https://images.unsplash.com/photo-1592194996308-7b43878e84a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fGdhd98ZW58MHx8fDE2NjY3MTQ3MjA&ixlib=rb-1.2.1&q=80&w=400")}
                />
                <img
                  src="https://static.vecteezy.com/system/resources/previews/022/518/779/non_2x/cute-kawaii-baby-panda-sitting-raising-hand-cartoon-character-icon-illustration-children-illustration-animal-nature-concept-flat-cartoon-style-vector.jpg"
                  alt="Panda"
                  style={styles.modalImage}
                  onClick={() => handleImageSelect("https://static.vecteezy.com/system/resources/previews/022/518/779/non_2x/cute-kawaii-baby-panda-sitting-raising-hand-cartoon-character-icon-illustration-children-illustration-animal-nature-concept-flat-cartoon-style-vector.jpg")}
                />
              </div>
              <button onClick={() => setIsModalOpen(false)} style={styles.modalCloseButton}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  profileContainer: {
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    color: '#fff',
    padding: '20px',
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center', 
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  container: {
    width: '80%',
    maxWidth: '800px',
    background: '#2c3e50',
    padding: '40px 20px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  formProfile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
    color: '#ff5722',
  },
  input: {
    marginBottom: '12px',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '5px',
    background: '#fff',
    color: '#333',
    width: '95%',
    fontSize: '14px',
  },
  textarea: {
    marginBottom: '12px',
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '5px',
    background: '#fff',
    color: '#333',
    width: '95%',
    fontSize: '14px',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c3e50',
    padding: '20px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    position: 'relative',
  },
  modalTitle: {
    marginBottom: '20px',
    fontSize: '20px',
    color: '#ff5722',
    textAlign: 'center',
  },
  imageOptions: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  modalImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  modalCloseButton: {
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
};

export default Profile;
