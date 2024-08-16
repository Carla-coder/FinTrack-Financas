import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Picker,
  ScrollView,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState(""); // Novo estado para "Tipo"
  const [transactions, setTransactions] = useState([]);

  // Função para calcular o saldo e os gastos
  const calculateBalanceAndExpenses = () => {
    let balance = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "renda") {
        balance += transaction.amount;
      } else if (transaction.type === "despesa") {
        expenses += transaction.amount;
      }
    });

    balance -= expenses; // Subtrai as despesas da renda para calcular o saldo

    return { balance, expenses };
  };

  const { balance, expenses } = calculateBalanceAndExpenses();

  const handleAddTransaction = () => {
    if (description && amount && date && category && type) {
      const newTransaction = {
        id: transactions.length + 1,
        description,
        amount: parseFloat(amount),
        date,
        category,
        type,
      };

      setTransactions([...transactions, newTransaction]);
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
      formattedDate += numbers.slice(0, 2); // Dia
    }
    if (numbers.length >= 3) {
      formattedDate += "/" + numbers.slice(2, 4); // Mês
    }
    if (numbers.length >= 5) {
      formattedDate += "/" + numbers.slice(4, 8); // Ano
    }

    setDate(formattedDate);
  };

  // Função para preparar os dados para o gráfico de fluxo de caixa
  const prepareLineChartData = () => {
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let incomeData = new Array(12).fill(0); 
    let expenseData = new Array(12).fill(0); 

    transactions.forEach((transaction) => {
        const dateParts = transaction.date.split("/");
        const monthIndex = parseInt(dateParts[1], 10) - 1; 
        if (transaction.type === "renda") {
            incomeData[monthIndex] += transaction.amount;
        } else if (transaction.type === "despesa") {
            expenseData[monthIndex] += transaction.amount;
        }
    });

    return {
        labels,
        datasets: [
            {
                data: incomeData.map((value) => (isNaN(value) ? 0 : value)),
                color: () => `rgba(75, 192, 192, 1)`,
                label: "Renda",
            },
            {
                data: expenseData.map((value) => (isNaN(value) ? 0 : value)),
                color: () => `rgba(255, 99, 132, 1)`,
                label: "Despesas",
            },
        ],
    };
  };

  // Função para preparar os dados para o gráfico de pizza
  const preparePieChartData = () => {
    let categoryTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "despesa") {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      }
    });

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      amount: categoryTotals[category],
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Gera uma cor aleatória
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.balanceContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Saldo Atual</Text>
            <Text
              style={[
                styles.balance,
                { color: balance >= 0 ? "green" : "red" } // Muda a cor dependendo do saldo
              ]}
            >
              R$ {balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Gastos do Mês</Text>
            <Text style={[styles.balance, { color: "red" }]}>
              R$ {expenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Fluxo de caixa</Text>
          <LineChart
            data={prepareLineChartData()}
            width={400}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f4f4f4",
              backgroundGradientTo: "#f4f4f4",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Categoria de Gastos</Text>
          <PieChart
            data={preparePieChartData()}
            width={400}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f4f4f4",
              backgroundGradientTo: "#f4f4f4",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Novas Transações</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text>{item.date}</Text>
                <Text>{item.description}</Text>
                <Text>{item.category}</Text>
                <Text>{item.type}</Text> {/* Exibe o tipo */}
                <Text>{item.amount.toFixed(2)}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Nova Transação</Text>
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
              selectedValue={type}
              style={styles.picker}
              onValueChange={(itemValue) => setType(itemValue)}
            >
              <Picker.Item label="Selecione o tipo" value="" />
              <Picker.Item label="Renda" value="renda" />
              <Picker.Item label="Despesa" value="despesa" />
            </Picker>

            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              <Picker.Item label="Alimentação" value="alimentacao" />
              <Picker.Item label="Transporte" value="transporte" />
              <Picker.Item label="Utilidades" value="utilidades" />
              <Picker.Item label="Entretenimento" value="entretenimento" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddTransaction}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.roundButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 20,
    width: "100%",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  transactionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: "100%",
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  roundButton: {
    backgroundColor: "#007bff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  roundButtonText: {
    color: "#fff",
    fontSize: 30,
  },
});
