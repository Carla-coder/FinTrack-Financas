import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function ReportsScreen() {
  const data = {
    labels: ["Alimentação", "Transporte", "Entretenimento", "Utilidades"],
    datasets: [
      {
        data: [1000, 500, 300, 500],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos por Categoria</Text>
        <BarChart
          data={data}
          width={300}
          height={220}
          yAxisLabel={"R$"}
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
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Visão Geral de Despesas</Text>
        <Text>Alimentação: R$ 1.000,00</Text>
        <Text>Transporte: R$ 500,00</Text>
        <Text>Entretenimento: R$ 300,00</Text>
        <Text>Utilidades: R$ 500,00</Text>
      </View>
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
});
