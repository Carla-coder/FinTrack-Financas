import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não correspondem!");
      return;
    }

    try {
      await AsyncStorage.setItem(`${email}_userPassword`, password);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logomarca.png")} style={styles.logo} />
        </View>
        <Text style={styles.title}>Bem-vindo à FinTrack</Text>
        <Text style={styles.welcomeMessage}>
          Cadastre-se para gerenciar suas finanças de forma fácil e eficiente!
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              required
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.inputGroupText}
            >
              <Icon
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#7ebab6"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirme a Senha:</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              required
            />
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.inputGroupText}
            >
              <Icon
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="#7ebab6"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
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
  registerContainer: {
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
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputGroupText: {
    marginLeft: 10,
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
});

export default RegisterScreen;
