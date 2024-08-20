import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "./screens/DashboardScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import BudgetsScreen from "./screens/BudgetsScreen";
import ReportsScreen from "./screens/ReportsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="AppTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
