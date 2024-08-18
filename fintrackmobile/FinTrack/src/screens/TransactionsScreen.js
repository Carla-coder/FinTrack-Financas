import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const transactions = [
  {
    date: "10/06/2023",
    description: "Supermercado",
    category: "Alimentação",
    amount: "-R$ 250,00",
  },
  {
    date: "08/06/2023",
    description: "Salário",
    category: "Renda",
    amount: "+R$ 3.500,00",
  },
  {
    date: "05/06/2023",
    description: "Conta de Luz",
    category: "Utilidades",
    amount: "-R$ 120,00",
  },
];

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text>{item.date}</Text>
            <Text>{item.description}</Text>
            <Text>{item.category}</Text>
            <Text
              style={[
                styles.amount,
                item.amount.startsWith("+") ? styles.income : styles.expense,
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  amount: {
    fontSize: 16,
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});
