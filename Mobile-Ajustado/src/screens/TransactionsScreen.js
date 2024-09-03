import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransactionsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);

  React.useEffect(() => {
    const loadTransactions = async () => {
      try {
        const savedTransactions = await AsyncStorage.getItem("transactions");
        if (savedTransactions !== null) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };

    loadTransactions();
  }, []);

  const handleAddTransaction = async () => {
    if (description && amount && date && category && type) {
      const newTransaction = {
        id: transactions.length + 1,
        description,
        amount: parseFloat(amount),
        date,
        category,
        type,
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      try {
        await AsyncStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );
      } catch (error) {
        console.error("Erro ao salvar transações:", error);
      }

      setDescription("");
      setAmount("");
      setDate("");
      setCategory("");
      setType("");
      setModalVisible(false);
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const handleEditTransaction = (item) => {
    setEditItem(item);
    setDescription(item.description);
    setAmount(item.amount.toString());
    setDate(item.date);
    setCategory(item.category);
    setType(item.type);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleUpdateTransaction = async () => {
    if (editItem && description && amount && date && category && type) {
      const updatedTransaction = {
        ...editItem,
        description,
        amount: parseFloat(amount),
        date,
        category,
        type,
      };

      const updatedTransactions = transactions.map((item) =>
        item.id === editItem.id ? updatedTransaction : item
      );

      setTransactions(updatedTransactions);

      try {
        await AsyncStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );
      } catch (error) {
        console.error("Erro ao salvar transações:", error);
      }

      setEditItem(null);
      setEditMode(false);
      setDescription("");
      setAmount("");
      setDate("");
      setCategory("");
      setType("");
      setModalVisible(false);
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const formatDate = (text) => {
    const numbers = text.replace(/\D/g, "");
    let formattedDate = "";

    if (numbers.length > 0) {
      formattedDate += numbers.slice(0, 2);
    }
    if (numbers.length >= 3) {
      formattedDate += "/" + numbers.slice(2, 4);
    }
    if (numbers.length >= 5) {
      formattedDate += "/" + numbers.slice(4, 8);
    }

    setDate(formattedDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Suas Transações:</Text>
          {transactions.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionDescription}>{item.description} - {item.category}</Text>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.type === "renda" ? "#2aad40" : "#df4822" },
                ]}
              >
                {item.type === "renda"
                  ? `+ R$ ${item.amount.toFixed(2)}`
                  : `- R$ ${item.amount.toFixed(2)}`}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTransaction(item)}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditMode(false);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? "Editar Transação" : "Adicionar Nova Transação"}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/AAAA)"
              value={date}
              onChangeText={formatDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
            />

            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Selecione a Categoria" value="" />
              <Picker.Item label="Alimentação" value="Alimentação" />
              <Picker.Item label="Renda Fixa" value="Renda Fixa" />
              <Picker.Item label="Transporte" value="Transporte" />
              <Picker.Item label="Combustivel" value="Combustivel" />
              <Picker.Item label="Moradia" value="Moradia" />
              <Picker.Item label="Lazer" value="Lazer" />
              <Picker.Item label="Educação" value="Educação" />
              <Picker.Item label="Saúde" value="Saúde" />
              <Picker.Item label="Utilidades" value="Utilidades" />
              <Picker.Item label="Viagens" value="Viagens" />
              <Picker.Item label="Eventos" value="Eventos" />
              <Picker.Item label="Presentes" value="Presentes" />
              <Picker.Item label="Cuidados Pessoais" value="Cuidados Pessoais" />
              <Picker.Item label="Assinaturas" value="Assinaturas" />
              <Picker.Item label="Impostos" value="Impostos" />
              <Picker.Item label="Seguros" value="Seguros" />
            </Picker>

            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={(itemValue) => setType(itemValue)}
            >
              <Picker.Item label="Selecione o Tipo" value="" />
              <Picker.Item label="Renda" value="renda" />
              <Picker.Item label="Despesa" value="despesa" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={
                editMode ? handleUpdateTransaction : handleAddTransaction
              }
            >
              <Text style={styles.saveButtonText}>
                {editMode ? "Atualizar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  transactionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#284767",
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d4af37",
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  transactionDate: {
    fontWeight: "bold",
    color: "#376f7b",
  },
  transactionDescription: {
    fontSize: 16,
    color: "#284767",
  },
  transactionCategory: {
    fontSize: 14,
    color: "#7ebab6",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  editButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#284767",
    borderRadius: 20,
    padding: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: "#ffff",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#376f7b",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284767",
  },
  closeButton: {
    backgroundColor: "#c2be99",
    borderRadius: 20,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#284767",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#d4af37",
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "transparent",
    borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#d4af37",
  },
  
  saveButton: {
    backgroundColor: "#376f7b",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
