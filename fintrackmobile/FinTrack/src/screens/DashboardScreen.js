import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Saldo Atual</Text>
        <Text style={[styles.balance, { color: 'green' }]}>R$ 5.234,56</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Gastos do Mês</Text>
        <Text style={[styles.balance, { color: 'red' }]}>R$ 2.145,30</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
