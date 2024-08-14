import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não correspondem!');
            return;
        }

        try {
            // Salvar o usuário no AsyncStorage
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userPassword', password);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login'); // Redireciona para a página de login após o cadastro
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao cadastrar. Tente novamente.');
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
            <Text style={styles.title}>Bem-vindo à Finance Manager</Text>
            <Text style={styles.welcomeMessage}>Crie sua conta para gerenciar suas finanças de forma fácil e eficiente!</Text>
            <View style={styles.formGroup}>
                <Text>Email</Text>
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
                <Text>Senha</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        required
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.inputGroupText}>
                        <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.formGroup}>
                <Text>Confirme a Senha</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        required
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.inputGroupText}>
                        <Icon name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <Button title="Cadastrar" onPress={handleRegister} color="#007bff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    welcomeMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    formGroup: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputGroupText: {
        marginLeft: 10,
    },
});
