// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Picker,
//   ScrollView,
// } from "react-native";
// import { LineChart, PieChart } from "react-native-chart-kit";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function DashboardScreen() {
//   const navigation = useNavigation();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("");
//   const [transactions, setTransactions] = useState([]);
//   const [menuVisible, setMenuVisible] = useState(false);

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };

//   // Carregar transações salvas
//   React.useEffect(() => {
//     const loadTransactions = async () => {
//       try {
//         const savedTransactions = await AsyncStorage.getItem("transactions");
//         if (savedTransactions !== null) {
//           setTransactions(JSON.parse(savedTransactions));
//         }
//       } catch (error) {
//         console.error("Erro ao carregar transações:", error);
//       }
//     };

//     loadTransactions();
//   }, []);

//   // Função para calcular o saldo e os gastos
//   const calculateBalanceAndExpenses = () => {
//     let balance = 0;
//     let expenses = 0;

//     transactions.forEach((transaction) => {
//       if (transaction.type === "renda") {
//         balance += transaction.amount;
//       } else if (transaction.type === "despesa") {
//         expenses += transaction.amount;
//       }
//     });

//     balance -= expenses; // Subtrai as despesas da renda para calcular o saldo

//     return { balance, expenses };
//   };

//   const { balance, expenses } = calculateBalanceAndExpenses();

//   const handleAddTransaction = async () => {
//     if (description && amount && date && category && type) {
//       const newTransaction = {
//         id: transactions.length + 1,
//         description,
//         amount: parseFloat(amount),
//         date,
//         category,
//         type,
//       };

//       const updatedTransactions = [...transactions, newTransaction];
//       setTransactions(updatedTransactions);

//       // Salvar no AsyncStorage
//       try {
//         await AsyncStorage.setItem(
//           "transactions",
//           JSON.stringify(updatedTransactions)
//         );
//       } catch (error) {
//         console.error("Erro ao salvar transações:", error);
//       }

//       setDescription("");
//       setAmount("");
//       setDate("");
//       setCategory("");
//       setType("");
//       setModalVisible(false);
//     } else {
//       alert("Por favor, preencha todos os campos.");
//     }
//   };

//   const formatDate = (text) => {
//     const numbers = text.replace(/\D/g, "");
//     let formattedDate = "";

//     if (numbers.length > 0) {
//       formattedDate += numbers.slice(0, 2); // Dia
//     }
//     if (numbers.length >= 3) {
//       formattedDate += "/" + numbers.slice(2, 4); // Mês
//     }
//     if (numbers.length >= 5) {
//       formattedDate += "/" + numbers.slice(4, 8); // Ano
//     }

//     setDate(formattedDate);
//   };

//   // Função para preparar os dados para o gráfico de fluxo de caixa
//   const prepareLineChartData = () => {
//     const labels = [
//       "Jan",
//       "Fev",
//       "Mar",
//       "Abr",
//       "Mai",
//       "Jun",
//       "Jul",
//       "Ago",
//       "Set",
//       "Out",
//       "Nov",
//       "Dez",
//     ];
//     let incomeData = new Array(12).fill(0);
//     let expenseData = new Array(12).fill(0);

//     transactions.forEach((transaction) => {
//       const dateParts = transaction.date.split("/");
//       const monthIndex = parseInt(dateParts[1], 10) - 1;
//       if (transaction.type === "renda") {
//         incomeData[monthIndex] += transaction.amount;
//       } else if (transaction.type === "despesa") {
//         expenseData[monthIndex] += transaction.amount;
//       }
//     });

//     return {
//       labels,
//       datasets: [
//         {
//           data: incomeData.map((value) => (isNaN(value) ? 0 : value)),
//           color: () => `rgba(75, 192, 192, 1)`,
//           label: "Renda",
//         },
//         {
//           data: expenseData.map((value) => (isNaN(value) ? 0 : value)),
//           color: () => `rgba(255, 99, 132, 1)`,
//           label: "Despesas",
//         },
//       ],
//     };
//   };

//   // Função para preparar os dados para o gráfico de pizza
//   const preparePieChartData = () => {
//     let categoryTotals = {};

//     transactions.forEach((transaction) => {
//       if (transaction.type === "despesa") {
//         if (!categoryTotals[transaction.category]) {
//           categoryTotals[transaction.category] = 0;
//         }
//         categoryTotals[transaction.category] += transaction.amount;
//       }
//     });

//     return Object.keys(categoryTotals).map((category) => ({
//       name: category,
//       amount: categoryTotals[category],
//       color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // gera uma cor aleatória
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     }));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.financialManagementContainer}>
//           <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
//             <Ionicons name="menu" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.financialManagementText}>Gestão Financeira</Text>
//         </View>
//       </View>

//       {menuVisible && (
//         <View style={styles.menuContainer}>
//           <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
//             <Text style={styles.menuItem}>Transações</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("Budgets")}>
//             <Text style={styles.menuItem}>Orçamentos</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
//             <Text style={styles.menuItem}>Relatórios</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <View style={styles.balanceContainer}>
//           <View style={styles.card}>
//             <Text style={styles.title}>Lucros do Mês:</Text>
//             <Text
//               style={[
//                 styles.balance,
//                 { color: balance >= 0 ? "green" : "red" },
//               ]}
//             >
//               R$ {balance.toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.card}>
//             <Text style={styles.title}>Gastos do Mês:</Text>
//             <Text style={[styles.balance, { color: "red" }]}>
//               R$ {expenses.toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Container de Fluxo de Caixa */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Fluxo de Caixa:</Text>
//           <LineChart
//             data={prepareLineChartData()}
//             width={400}
//             height={220}
//             chartConfig={{
//               backgroundColor: "#fff",
//               backgroundGradientFrom: "#f4f4f4",
//               backgroundGradientTo: "#f4f4f4",
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             }}
//             style={styles.chart}
//           />
//         </View>

//         {/* Container de Categorias de Gastos */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Categorias de Gastos:</Text>
//           <View style={styles.chartWrapper}>
//             <PieChart
//               data={preparePieChartData()}
//               width={400}
//               height={220}
//               chartConfig={{
//                 backgroundColor: "#fff",
//                 backgroundGradientFrom: "#f4f4f4",
//                 backgroundGradientTo: "#f4f4f4",
//                 decimalPlaces: 2,
//                 color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               }}
//               accessor="amount"
//               backgroundColor="transparent"
//               paddingLeft="15"
//               style={styles.chart}
//             />
//           </View>
//         </View>

//         <View style={styles.transactionsContainer}>
//           <Text style={styles.transactionsTitle}>Últimas Transações:</Text>
//           <View style={styles.transactionHeader}>
//             <Text style={styles.transactionHeaderText}>Data</Text>
//             <Text style={styles.transactionHeaderText}>Descrição</Text>
//             <Text style={styles.transactionHeaderText}>Categoria</Text>
//             <Text style={styles.transactionHeaderText}>Tipo</Text>
//             <Text style={styles.transactionHeaderText}>Valor</Text>
//           </View>
//           <FlatList
//             data={transactions}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.transactionItem}>
//                 <Text>{item.date}</Text>
//                 <Text>{item.description}</Text>
//                 <Text>{item.category}</Text>
//                 <Text>{item.type}</Text>
//                 <Text
//                   style={[
//                     styles.transactionAmount,
//                     { color: item.type === "renda" ? "blue" : "red" },
//                   ]}
//                 >
//                   {item.type === "renda"
//                     ? `+ R$ ${item.amount.toFixed(2)}`
//                     : `- R$ ${item.amount.toFixed(2)}`}
//                 </Text>
//               </View>
//             )}
//             contentContainerStyle={{ paddingBottom: 80 }}
//           />
//         </View>
//       </ScrollView>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Adicionar Nova Transação</Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.closeButtonText}>X</Text>
//               </TouchableOpacity>
//             </View>

//             <TextInput
//               style={styles.input}
//               placeholder="Data (DD/MM/AAAA)"
//               value={date}
//               onChangeText={formatDate}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Descrição"
//               value={description}
//               onChangeText={setDescription}
//             />

//             <Picker
//               selectedValue={category}
//               style={styles.picker}
//               onValueChange={(itemValue) => setCategory(itemValue)}
//             >
//               <Picker.Item label="Selecione a Categoria" value="" />
//               <Picker.Item label="Alimentação" value="Alimentação" />
//               <Picker.Item label="Renda Fixa" value="Renda Fixa" />
//               <Picker.Item label="Transporte" value="Transporte" />
//               <Picker.Item label="Moradia" value="Moradia" />
//               <Picker.Item label="Lazer" value="Lazer" />
//               <Picker.Item label="Educação" value="Educação" />
//               <Picker.Item label="Saúde" value="Saúde" />
//               <Picker.Item label="Utilidades" value="Utilidades" />
//               <Picker.Item label="Viagens" value="Viagens" />
//               <Picker.Item label="Eventos" value="Eventos" />
//               <Picker.Item label="Presentes" value="Presentes" />
//               <Picker.Item
//                 label="Cuidados Pessoais"
//                 value="Cuidados Pessoais"
//               />
//               <Picker.Item label="Assinaturas" value="Assinaturas" />
//               <Picker.Item label="Impostos" value="Impostos" />
//               <Picker.Item label="Seguros" value="Seguros" />
//             </Picker>

//             <Picker
//               selectedValue={type}
//               style={styles.picker}
//               onValueChange={(itemValue) => setType(itemValue)}
//             >
//               <Picker.Item label="Selecione o Tipo" value="" />
//               <Picker.Item label="Renda" value="renda" />
//               <Picker.Item label="Despesa" value="despesa" />
//             </Picker>

//             <TextInput
//               style={styles.input}
//               placeholder="Valor"
//               value={amount}
//               onChangeText={setAmount}
//               keyboardType="numeric"
//             />

//             <TouchableOpacity
//               style={styles.saveButton}
//               onPress={handleAddTransaction}
//             >
//               <Text style={styles.saveButtonText}>Salvar</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   headerContainer: {
//     width: "100%",
//   },
//   financialManagementContainer: {
//     backgroundColor: "#8ccaef",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     // borderRadius: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   financialManagementText: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   menuIcon: {
//     marginLeft: 10,
//   },
//   menuContainer: {
//     backgroundColor: "#fff",
//     padding: 10,
//     // borderRadius: 5,
//     elevation: 2,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   menuItem: {
//     fontSize: 18,
//     paddingVertical: 5,
//   },
//   scrollView: {
//     flexGrow: 1,
//   },
//   balanceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     // borderRadius: 10,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     width: "48%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   balance: {
//     fontSize: 20,
//   },
//   chartContainer: {
//     marginBottom: 20,
//     backgroundColor: "#fff",
//     // borderRadius: 10,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   chart: {
//     // borderRadius: 10,
//   },
//   transactionsContainer: {
//     backgroundColor: "#fff",
//     // borderRadius: 8,
//     padding: 10,
//     width: "100%",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   transactionsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "left",
//   },
//   transactionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#e0e0e0",
//     padding: 10,
//   },
//   transactionHeaderText: {
//     fontWeight: "bold",
//   },
//   transactionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 8,
//     width: "80%",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   closeButton: {
//     backgroundColor: "#8ccaef",
//     padding: 5,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   input: {
//     backgroundColor: "#f4f4f4",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   picker: {
//     backgroundColor: "#f4f4f4",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   fab: {
//     backgroundColor: "#8ccaef",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     bottom: 40,
//     right: 40,
//     zIndex: 1,
//   },
//   fabText: {
//     color: "#fff",
//     fontSize: 24,
//   },
//   saveButton: {
//     backgroundColor: "#8ccaef",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Carregar transações salvas
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
              R$ {expenses.toFixed(2)}
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
                decimalPlaces: 2,
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
            <Text style={styles.transactionHeaderText}>Categoria</Text>
            <Text style={styles.transactionHeaderText}>Tipo</Text>
            <Text style={styles.transactionHeaderText}>Valor</Text>
          </View>

          <FlatList
            data={transactions.slice(-3)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionDetail}>{item.date}</Text>
                <Text style={styles.transactionDetail}>{item.description}</Text>
                <Text style={styles.transactionDetail}>{item.category}</Text>
                <Text style={styles.transactionDetail}>{item.type}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === "renda" ? "blue" : "red" },
                  ]}
                >
                  {item.type === "renda"
                    ? `+ R$ ${item.amount.toFixed(2)}`
                    : `- R$ ${item.amount.toFixed(2)}`}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
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
    // borderRadius: 8,
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
    // borderRadius: 5,
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
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    // borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "48%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  balance: {
    fontSize: 20,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    // borderRadius: 10,
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
  chart: {
    // borderRadius: 10,
  },
  transactionsContainer: {
    backgroundColor: "#fff",
    // borderRadius: 8,
    padding: 10,
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e0e0e0",
    padding: 10,
  },
  transactionHeaderText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  transactionDetail: {
    width: "20%",
    textAlign: "left",
  },
  transactionAmount: {
    width: "20%",
    fontSize: 16,
    textAlign: "left",
  },
});
