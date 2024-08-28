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
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { v4 as uuidv4 } from 'uuid';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function BudgetScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Gastos por Categoria (%)',
        data: [],
        backgroundColor: 'rgba(72, 138, 201, 0.6)',
        borderColor: 'rgba(72, 138, 201, 1)',
        borderWidth: 1,
        barThickness: 15,
      },
    ],
  });

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
    const chartData = [];

    budgets.forEach((budget) => {
      const spentAmount = transactions
        .filter((transaction) => transaction.category === budget.category)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

      const percentageSpent = (spentAmount / budget.budgetAmount) * 100;

      labels.push(budget.category);
      chartData.push(percentageSpent);
    });

    setData({
      labels,
      datasets: [
        {
          label: 'Gastos por Categoria (%)',
          data: chartData,
          backgroundColor: 'rgba(72, 138, 201, 0.6)',
          borderColor: 'rgba(72, 138, 201, 1)',
          borderWidth: 1,
          barThickness: 15,
        },
      ],
    });
  }, [budgets, transactions]);

  const handleAddBudget = async () => {
    if (category && budgetAmount) {
      const newBudget = {
        id: uuidv4(), // Gere um ID único
        category,
        budgetAmount: parseFloat(budgetAmount),
      };

      const updatedBudgets = [...budgets, newBudget];
      setBudgets(updatedBudgets);

      try {
        await AsyncStorage.setItem("budgets", JSON.stringify(updatedBudgets));
      } catch (error) {
        console.error("Erro ao salvar orçamentos:", error);
      }

      setCategory("");
      setBudgetAmount("");
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

  const renderBudgetCard = ({ item }) => {
    const spentAmount = transactions
      .filter((transaction) => transaction.category === item.category)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const isExceeded = spentAmount > item.budgetAmount;
  
    return (
      <View style={styles.budgetCard}>
        <Text style={styles.budgetCategory}>{item.category}</Text>
        <Text style={[styles.budgetDetails, styles.budgetOrcado]}>
          Orçado: <Text style={styles.greenText}>+R${item.budgetAmount.toFixed(2)}</Text>
        </Text>
        <Text style={[styles.budgetDetails, styles.budgetGasto]}>
          Gasto: <Text style={styles.redText}>-R${spentAmount.toFixed(2)}</Text>
        </Text>
        <Text
          style={[
            styles.budgetStatus,
            { color: isExceeded ? "#df4822" : "#2aad40" },
          ]}
        >
          {isExceeded ? "Excedido" : "Alinhado"}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setCategory(item.category);
              setBudgetAmount(item.budgetAmount.toString());
              setModalVisible(true);
            }}
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
          <Text style={styles.Title}>Suas Metas:</Text>
          <View style={styles.chartContainer}>
            <Bar
              data={data}
              width={Dimensions.get("window").width - 30}
              height={230}
              options={{
                responsive: true,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#284767',
                      font: {
                        size: 14,
                      },
                    },
                  },
                  tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#284767',
                    bodyColor: '#376f7b',
                    borderColor: '#d4af37',
                    borderWidth: 1,
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.raw.toFixed(2)}%`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: '#376f7b',
                      callback: function (value) {
                        return `${value}%`;
                      },
                    },
                    grid: {
                      color: '#ccc',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#376f7b',
                    },
                    grid: {
                      color: '#ccc',
                    },
                  },
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.budgetsContainer}>
          <Text style={styles.budgetsTitle}>Orçamentos:</Text>
          <FlatList
            data={budgets}
            renderItem={renderBudgetCard}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.budgetsGrid}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setCategory("");
          setBudgetAmount("");
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
              placeholder="Valor Orçado"
              keyboardType="numeric"
              value={budgetAmount}
              onChangeText={(text) => setBudgetAmount(text)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleAddBudget}>
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  Title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#284767",
  },
  greenText: {
    color: "#2aad40",
  },
  redText: {
    color: "#df4822", 
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d4af37",
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  chart: {
    width: '100%',
  },
  budgetsContainer: {
    marginTop: 20,
  },
  budgetsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#284767",
  },
  budgetsGrid: {
    flexDirection: 'row',
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: "#d4af37",
    borderWidth: 1,
    marginHorizontal: 6,
    width: Dimensions.get('window').width / 1.8, 
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#284767",
  },
  budgetDetails: {
    fontSize: 14,
    marginTop: 5,
  },
  budgetOrcado: {
    color: '#284767',
  },
  budgetGasto: {
    color: '#376f7b',
  },
  budgetStatus: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#7ebab6',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#df4822',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButtonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#376f7b',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#df4822',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  picker: {
    height: 50,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#7ebab6',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
