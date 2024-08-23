import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Tentando login:", email, password); // Log para depuração
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");

      console.log("Email armazenado:", storedEmail); // Log para depuração
      console.log("Senha armazenada:", storedPassword); // Log para depuração

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
      console.error("Erro ao fazer login:", error); // Log para depuração
      Alert.alert("Erro", "Ocorreu um erro ao fazer login.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logomarca.png")} style={styles.logo} />
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

        {/* Botão para navegar para a tela de cadastro */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.registerButtonText}>
            Não tem uma conta? Cadastre-se
          </Text>
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
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
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
    backgroundColor: "#8ccaef",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#474fa2",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
