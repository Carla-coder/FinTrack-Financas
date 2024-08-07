import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/favicon.png'; 

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      const storedProfile = JSON.parse(await AsyncStorage.getItem('profile')) || {
        profileImage: logo,
        name: "Nome Completo",
        email: storedUser.email,
        address: "Endereço Completo"
      };
      await AsyncStorage.setItem('profile', JSON.stringify(storedProfile));
      navigation.navigate('Home');
      setError('');
    } else {
      setError('Email ou senha incorretos.');
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const newUser = { email, password };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    const defaultProfile = {
      profileImage: logo,
      name: "Nome Completo",
      email: newUser.email,
      address: "Endereço Completo"
    };
    await AsyncStorage.setItem('profile', JSON.stringify(defaultProfile));
    setIsRegistering(false);
    setError('');
    navigation.navigate('Home');
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={logo} 
        style={styles.logo} 
      />
      <View style={styles.loginBox}>
        <Text style={styles.title}>{isRegistering ? 'Cadastro' : 'Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
          <Text style={styles.buttonText}>{isRegistering ? 'Cadastrar' : 'Entrar'}</Text>
        </TouchableOpacity>
        <Text style={styles.registerPrompt}>
          {isRegistering ? 'Já tem uma conta?' : 'Não tem conta?'}
          <Text style={styles.toggleButton} onPress={toggleRegister}>
            {isRegistering ? ' Entrar' : ' Cadastrar'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: '50%',
    height: '30%',
    resizeMode: 'contain',
    marginTop: height * 0.01,
    marginBottom: 10,
  },
  loginBox: {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  title: {
    marginBottom: 20,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#006400',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    color: '#00FF00',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: '#FF6347',
    marginVertical: 10,
    textAlign: 'center',
  },
  registerPrompt: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
