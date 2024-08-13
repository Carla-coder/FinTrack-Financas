import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");

      if (!storedEmail || !storedPassword) {
        Alert.alert("Erro", "Você precisa se cadastrar primeiro!");
        return;
      }

      if (email === storedEmail && password === storedPassword) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        navigation.navigate("AppTabs"); // Navega para AppTabs após o login bem-sucedido
      } else {
        Alert.alert("Erro", "Email ou senha incorretos!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.formGroup}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formGroup}>
          <Text>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  loginContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginScreen;



