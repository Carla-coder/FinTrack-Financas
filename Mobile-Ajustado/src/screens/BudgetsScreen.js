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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

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
        label: 'Gastos por Categoria',
        data: [],
        backgroundColor: 'rgba(72, 138, 201, 0.6)',
        borderColor: 'rgba(72, 138, 201, 1)',
        borderWidth: 1,
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

      labels.push(budget.category);
      chartData.push(spentAmount);
    });

    setData({
      labels,
      datasets: [
        {
          label: 'Gastos por Categoria',
          data: chartData,
          backgroundColor: 'rgba(72, 138, 201, 0.6)',
          borderColor: 'rgba(72, 138, 201, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [budgets, transactions]);

  const handleAddBudget = async () => {
    if (category && budgetAmount) {
      const newBudget = {
        id: budgets.length + 1,
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
        <Bar
            data={data}
            width={Dimensions.get("window").width - 30} // Largura do gráfico
            height={250} // Altura do gráfico
            options={{
              indexAxis: 'y', // Configura o gráfico como horizontal
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `R$ ${tooltipItem.raw.toFixed(2)}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return `R$ ${value}`;
                    }
                  }
                },
                y: {
                  beginAtZero: true,
                }
              }
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.budgetsContainer}>
          <Text style={styles.budgetsTitle}>Orçamentos:</Text>
          {budgets.map((item) => {
            const spentAmount = transactions
              .filter((transaction) => transaction.category === item.category)
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            const isExceeded = spentAmount > item.budgetAmount;

            return (
              <View key={item.id} style={styles.budgetCard}>
                <Text style={styles.budgetCategory}>{item.category}</Text>
                <Text style={styles.budgetDetails}>
                  Valor Orçado: R$ {item.budgetAmount.toFixed(2)}
                </Text>
                <Text style={styles.budgetDetails}>
                  Valor Gasto: R$ {spentAmount.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.budgetStatus,
                    { color: isExceeded ? "#df4822" : "#2aad40" },
                  ]}
                >
                  {isExceeded ? "Excedido" : "Dentro do Orçamento"}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setCategory(item.category);
                    setBudgetAmount(item.budgetAmount.toString());
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.editButtonText}>✎</Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
              <Picker.Item label="Viagens" value="Viagens" />
              <Picker.Item label="Eventos" value="Eventos" />
              <Picker.Item label="Presentes" value="Presentes" />
              <Picker.Item label="Cuidados Pessoais" value="Cuidados Pessoais" />
              <Picker.Item label="Assinaturas" value="Assinaturas" />
              <Picker.Item label="Impostos" value="Impostos" />
              <Picker.Item label="Seguros" value="Seguros" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Valor Orçado"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
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
    flexGrow: 1,
    paddingBottom: 80,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  budgetsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d4af37",
    margin: 10,
    padding: 10,
    elevation: 2,
  },
  budgetsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#284767",
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d4af37",
    padding: 15,
    marginBottom: 10,
    position: "relative",
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284767",
  },
  budgetDetails: {
    fontSize: 16,
    color: "#284767",
  },
  budgetStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: "#7ebab6",
    borderRadius: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7ebab6",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284767",
  },
  closeButton: {
    backgroundColor: "#7ebab6",
    borderRadius: 10,
    padding: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#7ebab6",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#284767",
  },
  saveButton: {
    backgroundColor: "#7ebab6",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
