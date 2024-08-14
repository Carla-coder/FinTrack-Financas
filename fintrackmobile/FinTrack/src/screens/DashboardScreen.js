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
// } from "react-native";
// import { LineChart } from "react-native-chart-kit";

// export default function DashboardScreen() {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [transactions, setTransactions] = useState([]);

//   const handleAddTransaction = () => {
//     if (description && amount && date && category) {
//       const newTransaction = {
//         id: transactions.length + 1,
//         description,
//         amount: parseFloat(amount),
//         date,
//         category,
//       };

//       setTransactions([...transactions, newTransaction]);
//       setDescription("");
//       setAmount("");
//       setDate("");
//       setCategory("");
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

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Saldo Atual</Text>
//         <Text style={[styles.balance, { color: "green" }]}>R$ 5.234,56</Text>
//       </View>
//       <View style={styles.card}>
//         <Text style={styles.title}>Gastos do Mês</Text>
//         <Text style={[styles.balance, { color: "red" }]}>R$ 2.145,30</Text>
//       </View>

//       <LineChart
//         data={{
//           labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
//           datasets: [
//             {
//               data: [3000, 3200, 3100, 3500, 3300, 3700],
//               color: () => `rgba(75, 192, 192, 1)`,
//             },
//             {
//               data: [2500, 2700, 2600, 2800, 2900, 3000],
//               color: () => `rgba(255, 99, 132, 1)`,
//             },
//           ],
//         }}
//         width={400}
//         height={220}
//         chartConfig={{
//           backgroundColor: "#fff",
//           backgroundGradientFrom: "#f4f4f4",
//           backgroundGradientTo: "#f4f4f4",
//           decimalPlaces: 2,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         style={styles.chart}
//       />

//       {/* Listar Transações */}
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.transactionItem}>
//             <Text>{item.date}</Text>
//             <Text>{item.description}</Text>
//             <Text>{item.category}</Text>
//             <Text>{item.amount.toFixed(2)}</Text>
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 280 }}
//       />

//       {/* Modal para adicionar transação */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>

         
//             {/* Container para título e botão de fechar */}
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
//               <Picker.Item label="Selecione uma categoria" value="" />
//               <Picker.Item label="Renda" value="renda" />
//               <Picker.Item label="Alimentação" value="alimentacao" />
//               <Picker.Item label="Transporte" value="transporte" />
//               <Picker.Item label="Utilidades" value="utilidades" />
//               <Picker.Item label="Entretenimento" value="entretenimento" />
//             </Picker>

//             {/* Input para valor */}
//             <TextInput
//               style={styles.input}
//               placeholder="Valor"
//               value={amount}
//               onChangeText={setAmount}
//               keyboardType="numeric"
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleAddTransaction}
//               >
//                 <Text style={styles.modalButtonText}>Salvar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.modalButtonText}>Cancelar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Botão redondo para abrir o modal */}
//       <TouchableOpacity
//         style={styles.roundButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.roundButtonText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   balance: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   transactionItem: {
//     backgroundColor: "#f4f4f4",
//     padding: 10,
//     borderRadius: 5,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     width: "100%",
//     masWidth: 400,
//     alignItems: "center",
//     position: "relative",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%", 
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   closeButton: {
//     position: "absolute", 
//     right: 0, 
//     top: 0, 
//     padding: 10,
//   },
//   closeButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   input: {
//     width: "90%",
//     padding: 10,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     fontSize: 16, 
//     height: 50, 
//     marginBottom: 20,
//   },
//   picker: {
//     width: "90%",
//     fontSize: 16, 
//     height: 50, 
//     borderColor: "#ccc", 
//     borderWidth: 1, 
//     borderRadius: 5, 
//     justifyContent: "center",
//     marginBottom: 20, 
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//   },
//   modalButton: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     backgroundColor: "#007bff",
//     marginHorizontal: 5,
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   roundButton: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#007bff",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 5,
//   },
//   roundButtonText: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });


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
import { LineChart } from "react-native-chart-kit";

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleAddTransaction = () => {
    if (description && amount && date && category) {
      const newTransaction = {
        id: transactions.length + 1,
        description,
        amount: parseFloat(amount),
        date,
        category,
      };

      setTransactions([...transactions, newTransaction]);
      setDescription("");
      setAmount("");
      setDate("");
      setCategory("");
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.title}>Saldo Atual</Text>
          <Text style={[styles.balance, { color: "green" }]}>R$ 5.234,56</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Gastos do Mês</Text>
          <Text style={[styles.balance, { color: "red" }]}>R$ 2.145,30</Text>
        </View>

        <LineChart
          data={{
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                data: [3000, 3200, 3100, 3500, 3300, 3700],
                color: () => `rgba(75, 192, 192, 1)`,
              },
              {
                data: [2500, 2700, 2600, 2800, 2900, 3000],
                color: () => `rgba(255, 99, 132, 1)`,
              },
            ],
          }}
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

        {/* Listar Transações */}
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text>{item.date}</Text>
              <Text>{item.description}</Text>
              <Text>{item.category}</Text>
              <Text>{item.amount.toFixed(2)}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }} // Aumentar paddingBottom para evitar sobreposição
        />
      </ScrollView>

      {/* Modal para adicionar transação */}
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
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              <Picker.Item label="Renda" value="renda" />
              <Picker.Item label="Alimentação" value="alimentacao" />
              <Picker.Item label="Transporte" value="transporte" />
              <Picker.Item label="Utilidades" value="utilidades" />
              <Picker.Item label="Entretenimento" value="entretenimento" />
            </Picker>

            {/* Input para valor */}
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

      {/* Botão redondo para abrir o modal */}
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
    paddingBottom: 80, // Aumentar o paddingBottom para evitar sobreposição
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionItem: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    marginBottom: 80,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    position: "relative",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  input: {
    width: "90%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    height: 50,
    marginBottom: 20,
  },
  picker: {
    width: "90%",
    fontSize: 16,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#007bff",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  roundButton: {
    position: "absolute",
    bottom: 80,
    right: 40, 
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  roundButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
