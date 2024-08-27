import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
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
          <Text style={styles.transactionsTitle}>Novas Transações:</Text>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionHeaderText}>Data</Text>
            <Text style={styles.transactionHeaderText}>Descrição</Text>
            <Text style={styles.transactionHeaderText}>Categoria</Text>
            <Text style={styles.transactionHeaderText}>Valor</Text>
            <Text style={styles.transactionHeaderText}>Ação</Text>
          </View>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionDetail}>{item.date}</Text>
                <Text style={styles.transactionDetail}>{item.description}</Text>
                <Text style={styles.transactionDetail}>{item.category}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === "renda" ? "#7ebab6" : "#376f7b" },
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
            )}
          />
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
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Adiciona espaço para o botão de adicionar
  },
  transactionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    elevation: 3,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#284767",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionHeaderText: {
    fontWeight: "bold",
    width: "20%",
    textAlign: "center",
    color: "#284767",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionDetail: {
    width: "20%",
    textAlign: "center",
    color: "#284767",
  },
  transactionAmount: {
    width: "20%",
    textAlign: "center",
    fontWeight: "bold",
  },
  editButton: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 20,
    color: "#7ebab6",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#376f7b",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
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
    width: "80%",
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284767",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#376f7b",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#284767",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#7ebab6",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
