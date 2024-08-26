import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

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

  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", updateLayout);

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
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
          color: () => `rgba(42, 173, 64, 1)`,
          label: "Renda",
        },
        {
          data: expenseData.map((value) => (isNaN(value) ? 0 : value)),
          color: () => `rgba(223, 72, 34, 1)`,
          label: "Despesas",
        },
      ],
    };
  };

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
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionRow}>
      <Text style={styles.transactionText}>{item.date}</Text>
      <Text style={styles.transactionText}>{item.description}</Text>
      <Text style={styles.transactionText}>R$ {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

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
        <View style={styles.balanceContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Saldo Atual:</Text>
            <Text
              style={[
                styles.balance,
                { color: balance >= 0 ? "#2aad40" : "#df4822" },
              ]}
            >
              R$ {balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Gastos do Mês:</Text>
            <Text style={[styles.balance, { color: "#df4822" }]}>
              R$ {expenses ? expenses.toFixed(2) : "0.00"}
            </Text>
          </View>
        </View>

        <View style={[styles.chartRow, { flexDirection: screenWidth > 600 ? 'row' : 'column' }]}>
          <View style={[styles.chartContainer, { width: screenWidth > 600 ? '48%' : '100%' }]}>
            <Text style={styles.chartTitle}>Fluxo de Caixa:</Text>
            <LineChart
              data={prepareLineChartData()}
              width={screenWidth > 600 ? (screenWidth - 60) / 2 : screenWidth - 40}
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
          </View>

          {/* <View style={[styles.chartContainer, { width: screenWidth > 600 ? '48%' : '100%' }]}>
            <Text style={styles.chartTitle}>Categorias de Gastos:</Text>
            <PieChart
              data={preparePieChartData()}
              width={screenWidth > 600 ? (screenWidth - 60) / 2 : screenWidth - 40}
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
        </View> */}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  headerContainer: {
    width: "100%",
  },
  financialManagementContainer: {
    backgroundColor: "#33608d",
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
    shadowRadius: 2,
    borderRadius: 5,
  },
  menuItem: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#33608d",
  },
  scrollView: {
    flexGrow: 1,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    height: 80,
    width: "100%",
    flex: 1,
    marginHorizontal: 3,
    alignItems: "center",
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#284767",
  },
  balance: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
  },
  // chartRow: {
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  // },
  // chartContainer: {
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   padding: 20,
  //   marginBottom: 20,
  //   elevation: 3,
  //   alignItems: "center",
  // },
  // chartTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "#284767",
  // },
  chartTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#284767",
    },
  transactionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  transactionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#376f7b",

  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  transactionText: {
    fontSize: 16,
    color: "#376f7b",
  },
});
