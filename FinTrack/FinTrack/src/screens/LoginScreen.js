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
      console.log("Tentando login:", email, password); 
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");

      console.log("Email armazenado:", storedEmail); 
      console.log("Senha armazenada:", storedPassword); 

      if (!storedEmail || !storedPassword) {
        Alert.alert("Erro", "Você precisa se cadastrar primeiro!");
        return;
      }

      if (email === storedEmail && password === storedPassword) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        navigation.navigate("AppTabs"); 
      } else {
        Alert.alert("Erro", "Email ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error); 
      Alert.alert("Erro", "Ocorreu um erro ao fazer login.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logomarca.png")} style={styles.logo} />
        </View>
        <Text style={styles.title}>Faça seu login</Text>
        <Text style={styles.welcomeMessage}>
          Entre e gerencie suas finanças de forma fácil e eficiente!
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email:</Text>
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
          <Text style={styles.label}>Senha:</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 130, 
    height: 130,
  },
  loginContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#c2be99", 
    borderWidth: 1,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#284767", 
  },
  welcomeMessage: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#376f7b", 
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    color: "#284767",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ceceb1",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#f4f4f4",
  },
  button: {
    backgroundColor: "#7ebab6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 17, 
  },
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#7ebab6",
    fontSize: 12,
    fontWeight: "bold", 
  },
});

export default LoginScreen;
