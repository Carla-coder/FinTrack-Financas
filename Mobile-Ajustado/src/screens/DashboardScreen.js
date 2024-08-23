import React, { useState, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
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

    balance -= expenses; 

    return { balance, expenses };
  };

  const { balance, expenses } = calculateBalanceAndExpenses();

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

      // Salvar no AsyncStorage
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
    const labels = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
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
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // gera uma cor aleatória
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  // Renderizar as últimas 3 transações
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionRow}>
      <Text style={styles.transactionText}>{item.date}</Text>
      <Text style={styles.transactionText}>{item.description}</Text>
      <Text style={styles.transactionText}>R$ {item.amount.toFixed(2)}</Text>
    </View>
  );

  // Dimensões da tela
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.financialManagementContainer}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.financialManagementText}>Gestão Financeira</Text>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
            <Text style={styles.menuItem}>Transações</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Budgets")}>
            <Text style={styles.menuItem}>Orçamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
            <Text style={styles.menuItem}>Relatórios</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.balanceContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Lucros do Mês:</Text>
            <Text
              style={[
                styles.balance,
                { color: balance >= 0 ? "green" : "red" },
              ]}
            >
              R$ {balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Gastos do Mês:</Text>
            <Text style={[styles.balance, { color: "red" }]}>
              R$ {expenses ? expenses.toFixed(2) : "0.00"}
            </Text>
          </View>
        </View>

        {/* Container de Fluxo de Caixa */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Fluxo de Caixa:</Text>
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

         {/* Container de Categorias de Gastos */}
         <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Categorias de Gastos:</Text>
          <View style={styles.chartWrapper}>
            <PieChart
              data={preparePieChartData()}
              width={400}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f4f4f4",
                backgroundGradientTo: "#f4f4f4",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Últimas Transações:</Text>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionHeaderText}>Data</Text>
            <Text style={styles.transactionHeaderText}>Descrição</Text>
            <Text style={styles.transactionHeaderText}>Valor</Text>
          </View>
          <FlatList
            data={transactions.slice(-3)} 
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  headerContainer: {
    width: "100%",
  },
  financialManagementContainer: {
    backgroundColor: "#8ccaef",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  financialManagementText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  menuIcon: {
    marginLeft: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 5,
  },
  scrollView: {
    flexGrow: 1,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: "48%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  balance: {
    fontSize: 18,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  transactionHeaderText: {
    fontWeight: "bold",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  transactionText: {
    fontSize: 14,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    width: "80%",
  },
  button: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
