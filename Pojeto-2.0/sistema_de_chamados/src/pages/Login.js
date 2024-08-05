import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 97.1vh;
  background: linear-gradient(135deg, #2c3e50, #3498db);
`;

const LoginBox = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 240px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #fff;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #333;
  color: #fff;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background: #ff5722;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e64a19;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff5722;
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
  margin-left: 5px;

  &:hover {
    color: #e64a19;
  }
`;

const ErrorMessage = styled.p`
  color: #ff5724;
`;

const RegisterPrompt = styled.p`
  color: #fff;
  margin-top: 10px;
`;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'email') {
        document.getElementById('passwordInput').focus();
      } else if (e.target.name === 'password') {
        isRegistering ? handleRegister() : handleLogin();
      }
    }
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      const storedProfile = JSON.parse(localStorage.getItem('profile')) || {
        profileImage: "https://via.placeholder.com/100?text=Profile",
        name: "Nome Completo",
        email: storedUser.email,
        address: "Endereço Completo"
      };
      localStorage.setItem('profile', JSON.stringify(storedProfile));
      onLogin(true);
      setError('');
    } else {
      setError('Email ou senha incorretos.');
    }
  };

  const handleRegister = () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const newUser = { email, password };
    localStorage.setItem('user', JSON.stringify(newUser));
    // Criar perfil padrão após registro
    const defaultProfile = {
      profileImage: "https://via.placeholder.com/100?text=Profile",
      name: "Nome Completo",
      email: newUser.email,
      address: "Endereço Completo"
    };
    localStorage.setItem('profile', JSON.stringify(defaultProfile));
    setIsRegistering(false);
    setError('');
    onLogin(true);
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <Container>
      <LoginBox>
        <Title>{isRegistering ? 'Cadastro' : 'Login'}</Title>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          name="password"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isRegistering ? (
          <Button onClick={handleRegister}>Cadastrar</Button>
        ) : (
          <Button onClick={handleLogin}>Entrar</Button>
        )}
        <RegisterPrompt>
          {isRegistering ? 'Já tem uma conta?' : 'Não tem conta?'}
          <ToggleButton onClick={toggleRegister}>
            {isRegistering ? 'Entrar' : 'Cadastrar'}
          </ToggleButton>
        </RegisterPrompt>
      </LoginBox>
    </Container>
  );
};

export default Login;
