import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ProgressBar, Colors } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";

export default function BudgetsScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [budgets, setBudgets] = React.useState({
    Alimentação: { budget: 1000, spent: 700 },
    Transporte: { budget: 500, spent: 425 },
    Entretenimento: { budget: 300, spent: 330 },
    Utilidades: { budget: 500, spent: 250 },
  });

  const handleAddBudget = () => {
    if (category && !isNaN(amount)) {
      const updatedBudgets = { ...budgets };
      updatedBudgets[category].spent += parseFloat(amount);
      setBudgets(updatedBudgets);
      setModalVisible(false);
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
    }
  };

  if (category && !isNaN(amount)) {
    const updatedBudgets = { ...budgets };
    if (!updatedBudgets[category]) {
      updatedBudgets[category] = { budget: 0, spent: 0 };
    }
    updatedBudgets[category].spent += parseFloat(amount);
    setBudgets(updatedBudgets);
    setModalVisible(false);
  }

  const chartData = Object.keys(budgets).map((key) => ({
    name: key,
    amount: budgets[key].budget,
    color:
      key === "Alimentação"
        ? Colors.green700
        : key === "Transporte"
        ? Colors.yellow700
        : key === "Entretenimento"
        ? Colors.red700
        : Colors.blue700,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Orçamentos</Text>

      {Object.keys(budgets).map((key) => (
        <View key={key} style={styles.card}>
          <Text style={styles.cardTitle}>{key}</Text>
          <ProgressBar
            progress={budgets[key].spent / budgets[key].budget}
            color={chartData.find((data) => data.name === key).color}
          />
          <Text>{`R$ ${budgets[key].spent.toFixed(2)} / R$ ${budgets[
            key
          ].budget.toFixed(2)}`}</Text>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Visão Geral</Text>
        <PieChart
          data={chartData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#f4f4f4",
            backgroundGradientFrom: "#f4f4f4",
            backgroundGradientTo: "#f4f4f4",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Adicionar Orçamento</Text>
          <TextInput
            placeholder="Categoria"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Valor Orçado"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Adicionar" onPress={handleAddBudget} />
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 30,
    padding: 15,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
  modalView: {
    marginTop: 100,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
