import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { v4 as uuidv4 } from 'uuid';

export default function BudgetScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        color: () => `#df4822`, // Red color for spent data
        label: "Gasto",
      },
      {
        data: [],
        color: () => `#7ebab6`, // Turquoise color for budget data
        label: "Orçado",
      },
    ],
  });

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const loadBudgetsAndTransactions = async () => {
      try {
        const savedBudgets = await AsyncStorage.getItem("budgets");
        if (savedBudgets !== null) {
          setBudgets(JSON.parse(savedBudgets));
        }
        const savedTransactions = await AsyncStorage.getItem("transactions");
        if (savedTransactions !== null) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadBudgetsAndTransactions();
  }, []);

  useEffect(() => {
    const labels = [];
    const spentData = [];
    const budgetData = [];

    budgets.forEach((budget) => {
      const spentAmount = transactions
        .filter((transaction) => transaction.category === budget.category)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      labels.push(budget.category);
      spentData.push(spentAmount);
      budgetData.push(budget.budgetAmount);
    });

    setData({
      labels,
      datasets: [
        {
          data: spentData,
          color: () => `#df4822`, // Red color for spent data
          label: "Gasto",
        },
        {
          data: budgetData,
          color: () => `#7ebab6`, // Turquoise color for budget data
          label: "Orçado",
        },
      ],
    });
  }, [budgets, transactions]);

  const handleAddBudget = async () => {
    if (category && budgetAmount) {
      const newBudget = {
        id: uuidv4(),
        category,
        budgetAmount: parseFloat(budgetAmount),
      };

      const updatedBudgets = editingBudget
        ? budgets.map((budget) =>
            budget.id === editingBudget.id ? newBudget : budget
          )
        : [...budgets, newBudget];
      setBudgets(updatedBudgets);

      try {
        await AsyncStorage.setItem("budgets", JSON.stringify(updatedBudgets));
      } catch (error) {
        console.error("Erro ao salvar orçamentos:", error);
      }

      setCategory("");
      setBudgetAmount("");
      setEditingBudget(null);
      setModalVisible(false);
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const handleDeleteBudget = async (id) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);

    try {
      await AsyncStorage.setItem("budgets", JSON.stringify(updatedBudgets));
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setBudgetAmount(budget.budgetAmount.toString());
    setModalVisible(true);
  };

  const renderBudgetCard = ({ item }) => {
    const spentAmount = transactions
      .filter((transaction) => transaction.category === item.category)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const isExceeded = spentAmount > item.budgetAmount;

    return (
      <View style={[styles.budgetCard, isExceeded && styles.exceededCard]}>
        <Text style={styles.budgetCategory}>{item.category}</Text>
        <Text style={[styles.budgetDetails]}>
          Orçado: <Text style={styles.budgetOrcado}>+ R${item.budgetAmount.toFixed(2)}</Text>
        </Text>
        <Text style={[styles.budgetDetails]}>
          Gasto: <Text style={styles.budgetGasto}>- R${spentAmount.toFixed(2)}</Text>
        </Text>
        {!isExceeded ? (
          <Text style={styles.dontExceedText}>Adequado</Text>
        ) : (
          <Text style={styles.exceededText}>Excedido</Text>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditBudget(item)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBudget(item.id)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.budgetsTitle}>Seu Orçamento:</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartCard}>
              <LineChart
                data={data}
                width={screenWidth - 30}
                height={230}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        </View>

        <View style={styles.budgetsContainer}>
          <Text style={styles.budgetsTitle}>Orçamentos:</Text>
          <FlatList
            data={budgets}
            renderItem={renderBudgetCard}
            keyExtractor={(item) => item.id}
            numColumns={2} 
            contentContainerStyle={styles.budgetsGrid}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setCategory("");
          setBudgetAmount("");
          setEditingBudget(null);
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
              <Text style={styles.modalTitle}>Adicionar Orçamento</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Selecione a Categoria" value="" />
              <Picker.Item label="Alimentação" value="Alimentação" />
              <Picker.Item label="Transporte" value="Transporte" />
              <Picker.Item label="Moradia" value="Moradia" />
              <Picker.Item label="Lazer" value="Lazer" />
              <Picker.Item label="Educação" value="Educação" />
              <Picker.Item label="Saúde" value="Saúde" />
              <Picker.Item label="Utilidades" value="Utilidades" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Valor do Orçamento"
              keyboardType="numeric"
              value={budgetAmount}
              onChangeText={(text) => setBudgetAmount(text)}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddBudget}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
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
    padding: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chartCard: {
    borderRadius: 16,
    borderColor: "#d4af37", 
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
  },
  chart: {
    borderRadius: 16,
  },
  Title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  budgetsContainer: {
    marginBottom: 20,
  },
  budgetsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284767",
    marginBottom: 10,
  },
  budgetsGrid: {
    justifyContent: "space-between",
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d4af37", 
    padding: 10,
    margin: 5,
    flex: 1,
    maxWidth: "48%", 
    justifyContent: "space-between",
  },
  exceededCard: {
    borderColor: "#df4822", 
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#284767",
  },
  budgetDetails: {
    fontSize: 14,
    color: "#284767",
  },
  budgetOrcado: {
    color: '#2aad40',
  },
  budgetGasto: {
    color: "#df4822", 
  },
  dontExceedText: {
    color: "green",
    fontWeight: "bold",
  },
  exceededText: {
    color: "#df4822",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#7ebab6',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#376f7b", 
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
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
    backgroundColor: "#e57373",
    padding: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#376f7b",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});