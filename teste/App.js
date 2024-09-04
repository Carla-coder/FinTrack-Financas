import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "./src/screens/DashboardScreen";
import TransactionsScreen from "./src/screens/TransactionsScreen";
import BudgetsScreen from "./src/screens/BudgetsScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Transações") {
            iconName = "list";
          } else if (route.name === "Orçamentos") {
            iconName = "wallet";
          } else if (route.name === "Relatórios") {
            iconName = "analytics";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transações" component={TransactionsScreen} />
      
      <Tab.Screen name="Orçamentos" component={BudgetsScreen} />
      <Tab.Screen name="Relatórios" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Cadastro"
          component={RegisterScreen}
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}